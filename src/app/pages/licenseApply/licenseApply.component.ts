import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';
import { NzModalService } from 'ng-zorro-antd/modal';

import { License } from '../../../apis/license/target/generated-sources/swagger/model/license';
import { ApplyService } from '../../../apis/license/target/generated-sources/swagger/api/apply.service';
import { QueryService } from '../../../apis/license/target/generated-sources/swagger/api/query.service';
import { I18nService } from '../../i18n/i18n.service';
import {
  FORMAT_DATE,
  DurationList,
  PERMANENT_TIME,
  ExpitationTime,
  NetworkLimit,
  SessionLimit,
  SessionLimitList,
  LicensePurposeList,
  NetworkLimitList,
} from './../../common/constant';

interface addressListType {
  id: number;
  ip: string;
  mac: string
}

interface FormLicense extends License {
  permitDuration?: string;
  netNums?: string;
  permitDays?: string;
  equipment?: string;
  sessionNums?: string;
}


@Component({
  selector: 'app-license-apply',
  templateUrl: './licenseApply.component.html',
  styleUrls: ['./licenseApply.component.less']
})
export class LicenseApplyComponent implements OnInit {
  licenseForm!: FormGroup;
  isLoading: boolean = false;
  today = new Date();
  subjectList: Array<string> = ['eNMS', 'MSTP'];
  purposeList: Array<any> = LicensePurposeList;
  netNumList: Array<any> = NetworkLimitList;
  durationList: Array<any> = DurationList;
  sessionLimitList: Array<any> = SessionLimitList;
  showCustomDuration: boolean = false;
  showCustomNetNum: boolean = false;
  showCustomSessionNum: boolean = false;
  showCustomEquipment: boolean = false;
  addressList: Array<addressListType> = [];
  equipmentList: any = [];
  equipmentTypesObj: any = { eNMS: [111, 222], MSTP: [333, 444] };
  CUSTOM_EQUIPMENT_TYPE = 'CUSTOM_EQUIPMENT_TYPE';
  controlledNameList: any = [];

  constructor(
    private fb: FormBuilder,
    private ApplyService: ApplyService,
    private message: NzMessageService,
    private i18n: I18nService,
    private modal: NzModalService,
    private QueryService: QueryService,
  ) { }

  ngOnInit(): void {
    this.licenseForm = this.fb.group({
      holder: [null, Validators.required],
      subject: [null, Validators.required],
      use: [null, Validators.required],
      notBefore: [new Date(), Validators.required],
      quantityLimit: [null, Validators.required],
      sessionLimit: [null, Validators.required],
      equipmentDescription: [null, Validators.required],
      info: [null],
      permitDuration: [null, Validators.required],
      controlledName: [null],
    });
    this.addNet();
    this.getEquipment();
    this.getControlledList(this.subjectList[0]);
  }

  getEquipment = () => {
    this.QueryService.getAllEquipment().subscribe(
      data => {
        this.equipmentTypesObj = data;
        this.equipmentList = this.equipmentTypesObj['eNMS'];
      }
    )
  }
  
  getControlledList = (subjectName: string) => {
    this.QueryService.getControl(subjectName).subscribe(
      data => {
        this.controlledNameList = data;
        this.controlledNameList.forEach((item, i) => {
          this.controlledNameList[i]['label'] = `${item.name} (${item.description})`;
        });
      }
    )
  }

  validateInt(control: FormControl): { [s: string]: boolean } {
    const reg = /^[1-9]+[0-9]*$/
    if (!control.value) {
      return { error: true, required: true };
    } else if (!reg.test(control.value)) {
      return { int: true, error: true };
    };
    return {};
  }

  formHandle() {
    for (const i in this.licenseForm.controls) {
      this.licenseForm.controls[i].markAsDirty();
      this.licenseForm.controls[i].updateValueAndValidity();
    }
    if (!this.licenseForm.valid) {
      return;
    }

    this.onSubmit(this.licenseForm.value);
  }

  // 重置之前先删除动态增加的control
  beforeReset = () => {
    const { permitDays, equipment, netNums, sessionNums } = this.licenseForm.value;
    permitDays && this.licenseForm.removeControl('permitDays');
    equipment && this.licenseForm.removeControl('equipment');
    netNums && this.licenseForm.removeControl('netNums');
    sessionNums && this.licenseForm.removeControl('netNums');
    this.addressList.map(({ ip, mac }) => {
      ip && this.licenseForm.removeControl(ip);
      mac && this.licenseForm.removeControl(mac);
    })
    this.showCustomDuration = false;
    this.showCustomNetNum = false;
    this.showCustomEquipment = false;
    this.showCustomSessionNum = false;
  }

  resetForm(e?: MouseEvent): void {
    e && e.preventDefault();
    this.beforeReset();
    this.licenseForm.reset();
    for (const key in this.licenseForm.controls) {
      this.licenseForm.controls[key].markAsPristine();
      this.licenseForm.controls[key].updateValueAndValidity();
    }
    this.afterReset();
  }

  afterReset = () => {
    this.addressList = [];
    this.addNet();
    this.licenseForm.get('notBefore')!.setValue(new Date());
    this.equipmentList = this.equipmentTypesObj['eNMS'];
  }

  onSubmit(values: FormLicense) {
    this.isLoading = true;
    const params = this.changeParmas(values);
    this.ApplyService.applyLicense(params).subscribe(
      () => {
        this.isLoading = false;
        this.modal.success({
          nzTitle: this.i18n.getValue('i18n_message.applySuccess'),
        });
        this.beforeReset()
        this.licenseForm.reset();
        this.afterReset();
      },
      () => {
        this.isLoading = false;
        this.message.create('error', this.i18n.getValue('i18n_message.operationFailed'));
      }
    );
  }

  changeParmas = (params: FormLicense) => {
    const serviceNeedsKeys = this.deleteUselessKey(params);
    const { notBefore, quantityLimit, netNums, permitDuration, permitDays, equipmentDescription, equipment,
      sessionLimit, sessionNums, ...rest } = serviceNeedsKeys;
    // 组装许可到期日期，根据许可开始日期和许可时长计算
    let notAfter = null;
    if (permitDuration === ExpitationTime.CUSTON_DAYS) {
      notAfter = moment(notBefore).add(permitDays, 'days').format(FORMAT_DATE);
    } else if (permitDuration === ExpitationTime.PERMANENT) {
      notAfter = PERMANENT_TIME;
    } else if (permitDuration && permitDuration.indexOf('年') !== -1) {
      const years = permitDuration.substring(0, 1);
      notAfter = moment(notBefore).add(years, 'years').format(FORMAT_DATE);
    } else if (permitDuration) {
      notAfter = moment(notBefore).add(permitDuration, 'days').format(FORMAT_DATE);
    }
    // 组装网管信息
    const netInfo = { ip: [], mac: [] };
    this.addressList.map(({ ip, mac }) => {
      ip && netInfo.ip.push(this.licenseForm.value[ip]);
      mac && netInfo.mac.push(this.licenseForm.value[mac]);
    })
    // 组装设备类型
    let equipmentTypes = equipmentDescription;
    if (equipmentDescription.includes(this.CUSTOM_EQUIPMENT_TYPE)) {
      if (equipment) {
        equipmentTypes.push(equipment);
        const index = equipmentTypes.indexOf(this.CUSTOM_EQUIPMENT_TYPE);
        equipmentTypes.splice(index, 1);
      }
    }
    return {
      ...rest,
      notBefore: notBefore && `${moment(notBefore).format(FORMAT_DATE)} 00:00:00`,
      notAfter: notBefore && `${notAfter} 23:59:59`,
      quantityLimit: quantityLimit === NetworkLimit.CUSTOM_NETWORK_LIMIT ? netNums : quantityLimit,
      sessionLimit: sessionLimit === SessionLimit.CUSTOM ? sessionNums : sessionLimit,
      equipmentDescription: equipmentTypes.join(','),
      extra: netInfo
    };
  }

  deleteUselessKey(params) {
    const newParams = JSON.parse(JSON.stringify(params));
    Object.keys(newParams).forEach(key => {
      if ((key.substring(0, 2) === 'ip') || (key.substring(0, 3) === 'mac')) {
        delete newParams[key];
      }
    });
    return newParams;
  }

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  }

  removeNet(i: addressListType, e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    if (this.addressList.length > 1) {
      const index = this.addressList.indexOf(i);
      this.addressList.splice(index, 1);
      this.licenseForm.removeControl(i.ip);
      this.licenseForm.removeControl(i.mac);
    }
  }

  addNet(e?: MouseEvent) {
    if (e) {
      e.preventDefault();
    }
    const id = this.addressList.length > 0 ? this.addressList[this.addressList.length - 1].id + 1 : 0;
    const control = {
      id,
      ip: `ip${id}`,
      mac: `mac${id}`,
    };
    const index = this.addressList.push(control);
    // console.log(this.addressList[this.addressList.length - 1]);
    this.licenseForm.addControl(this.addressList[index - 1].ip, new FormControl(null, [this.validateIp]));
    this.licenseForm.addControl(this.addressList[index - 1].mac, new FormControl(null, [this.validateMac]));
  }

  validateIp(control: FormControl): { [s: string]: boolean } {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (!control.value) {
      return { error: true, required: true };
    } else if (!reg.test(control.value)) {
      return { ip: true, error: true };
    };
    return {};
  }

  validateMac(control: FormControl): { [s: string]: boolean } {
    const reg = /[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}/;
    if (!control.value) {
      return { error: true, required: true };
    } else if (!reg.test(control.value)) {
      return { mac: true, error: true };
    };
    return {};
  }

  handleNetChange(value: string) {
    if (value === NetworkLimit.CUSTOM_NETWORK_LIMIT) {
      this.showCustomNetNum = true;
      this.licenseForm.addControl('netNums', new FormControl(null, [this.validateInt]));
    } else {
      this.showCustomNetNum = false;
      this.licenseForm.removeControl('netNums');
    }
  }

  handleSessionChange(value: string) {
    if (value === SessionLimit.CUSTOM) {
      this.showCustomSessionNum = true;
      this.licenseForm.addControl('sessionNums', new FormControl(null, [this.validateInt]));
    } else {
      this.showCustomSessionNum = false;
      this.licenseForm.removeControl('sessionNums');
    }
  }

  handleDurationChange(value: string) {
    if (value === ExpitationTime.CUSTON_DAYS) {
      this.showCustomDuration = true;
      this.licenseForm.addControl('permitDays', new FormControl(null, [this.validateInt]));
    } else {
      this.showCustomDuration = false;
      this.licenseForm.removeControl('permitDays');
    }
  }

  handleEquipmentChange(value) {
    if (value && value.includes(this.CUSTOM_EQUIPMENT_TYPE)) {
      this.showCustomEquipment = true;
      this.licenseForm.addControl('equipment', new FormControl(null, Validators.required));
    } else {
      this.showCustomEquipment = false;
      this.licenseForm.removeControl('equipment');
    }
  }

  handleSubjectChange(value: string) {
    this.equipmentList = this.equipmentTypesObj[value];
    this.licenseForm.get('equipmentDescription')!.setValue(null);
    this.getControlledList(value);
    this.licenseForm.get('controlledName')!.setValue(null);
  }

}
