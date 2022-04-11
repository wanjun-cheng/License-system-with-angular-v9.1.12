import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

import { QueryService } from '../../../../apis/license/target/generated-sources/swagger/api/query.service';
import {
  FORMAT_DATE,
  ExpitationDate,
  PERMANENT_TIME,
  LicensePurpose,
  LicensePurposeList,
  NetworkLimitList,
  ExpitationDateList,
  NetworkLimit,
  LicenseStatusList,
  SessionLimit,
  SessionLimitList,
} from './../../../common/constant';


@Component({
  selector: 'app-license-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class LicenseSearchComponent implements OnInit {
  licenseForm!: FormGroup;
  isCollapse:boolean = true;
  netNumList = NetworkLimitList;
  permitList = ExpitationDateList;
  licenseStatusList = LicenseStatusList;
  licensePurposeList = LicensePurposeList;
  sessionLimitList = SessionLimitList;
  NetworkLimit = NetworkLimit;
  SessionLimit = SessionLimit;
  ExpitationDate = ExpitationDate;
  LicensePurpose = LicensePurpose;
  quantityLimitNum: string = '';
  sessionLimitNum: string = '';
  permitValue: string = '';
  subjectList: Array<string> = ['eNMS', 'MSTP'];
  purposeList:Array<{value: string; label: string}> = [];
  applyList: Array<string> = [];
  approverList: Array<string> = [];
  selectList = {};
  controlledNameList: any = [];


  @Output() onSearch = new EventEmitter<any>();
  @Input() isManager: boolean;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public QueryService: QueryService,
  ) { }

  ngOnInit(): void {
    this.licenseForm = this.fb.group({
      email: [null],
      holder: [null],
      subject: [null],
      notAfter: [null],
      customNotAfter: [null],
      quantityLimit: [null],
      customQuantityLimit: [null],
      sessionLimit: [null],
      customSessionLimit: [null],
      use: [null],
      state: [null],
      approver: [null],
      controlledName: [null],
    });
    this.getSelectList();
    this.getControlledList(this.subjectList[0]);
  }

  getSelectList() {
    this.QueryService.getSubjectWithUse().subscribe(
      (data: any) => {
        this.selectList = data.subjectWithUse;
        this.applyList = data.email;
        this.approverList = data.approver;
        this.subjectList = Object.keys(data.subjectWithUse);
        this.purposeList = this.changePurposeList(this.subjectList[0]);
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

  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  handleSubjectChange(value?: string) {
    if (value) {
      this.formSubmit();
      this.purposeList = this.changePurposeList(value);
      this.getControlledList(value);
    }
  }

  changePurposeList(subject: string){
    const useList = this.selectList[subject];
    let newUseList = [];
    useList.forEach(element => {
      const use = this.licensePurposeList.filter((item) => {
        if(item.value == element){
          return item;
        }
      })
      newUseList.push(use[0]);
    });
    return newUseList;
  }

  handleChange(value?: string | Array<string>) {
    if (value) {
      if ((value === ExpitationDate.CUSTOM_DATE) || (value === NetworkLimit.CUSTOM_NETWORK_LIMIT) || 
      (value === SessionLimit.CUSTOM)) {
        return;
      }
      this.formSubmit();
    }
  }

  formSubmit() {
    for (const i in this.licenseForm.controls) {
      this.licenseForm.controls[i].markAsDirty();
      this.licenseForm.controls[i].updateValueAndValidity();
    }
    if (!this.licenseForm.valid) {
      return;
    }

    const params = this.changeParams(this.licenseForm.value);
    this.onSearch.emit(params);
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.licenseForm.reset();
    for (const key in this.licenseForm.controls) {
      this.licenseForm.controls[key].markAsPristine();
      this.licenseForm.controls[key].updateValueAndValidity();
    }

    this.onSearch.emit({});
  }

  changeParams(values) {
    const { notAfter, customNotAfter, quantityLimit, customQuantityLimit, sessionLimit, customSessionLimit, ...rest } = values;
    let dueDate = null;
    let params = { notAfterType: null };
    if (notAfter === ExpitationDate.DUE_SOON) {
      dueDate = moment(new Date()).add(30, 'days').format(FORMAT_DATE);
      params.notAfterType = ExpitationDate.DUE_SOON;
    } else if (notAfter === ExpitationDate.EXPIRED) {
      dueDate = moment(new Date()).subtract(1, 'days').format(FORMAT_DATE);
      params.notAfterType = ExpitationDate.EXPIRED;
    } else if (notAfter === ExpitationDate.CUSTOM_DATE) {
      dueDate = customNotAfter && moment(customNotAfter).format(FORMAT_DATE);
      params.notAfterType = ExpitationDate.CUSTOM_DATE;
    } else if (notAfter === ExpitationDate.PERMANENT) {
      dueDate = PERMANENT_TIME;
      params.notAfterType = ExpitationDate.PERMANENT;
    }
    return {
      ...rest,
      notAfter: dueDate && `${dueDate} 23:59:59`,
      quantityLimit: quantityLimit === NetworkLimit.CUSTOM_NETWORK_LIMIT ? customQuantityLimit : quantityLimit,
      sessionLimit: sessionLimit === SessionLimit.CUSTOM ? customSessionLimit : sessionLimit,
      params
    };
  }

}
