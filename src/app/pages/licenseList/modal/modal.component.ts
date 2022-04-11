import { Component, OnInit, EventEmitter, Input, Output, } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { License } from '../../../../apis/license/target/generated-sources/swagger/model/license';
import { UpdateService } from '../../../../apis/license/target/generated-sources/swagger/api/update.service';
import { I18nService } from '../../../i18n/i18n.service';
import { LicenseStatus } from '../../../common/constant';


@Component({
  selector: 'app-license-approval',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less'],
})
export class LicenseModalComponent implements OnInit {
  approvalForm!: FormGroup;
  LicenseStatus = LicenseStatus;
  isOkLoading: boolean = false;
  stateValue: string = '';
  approvalCommentValue: string = '';

  @Output() onOk = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();
  @Input() isVisible: boolean;
  @Input() approvalParams: License;

  constructor(
    private fb: FormBuilder,
    public UpdateService: UpdateService,
    private message: NzMessageService,
    private i18n: I18nService,
  ) { }

  ngOnInit(): void {
    this.approvalForm = this.fb.group({
      approvalComment: [null, Validators.required],
      state: [null, Validators.required],
    });
  }

  handleOk(): void {
    if (!this.approvalForm.valid) {
      for (const i in this.approvalForm.controls) {
        this.approvalForm.controls[i].markAsDirty();
        this.approvalForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    this.isOkLoading = true;
    const { approvalComment } = this.approvalForm.value;
    this.updateStatus({ ...this.approvalParams, approvalComment });
  }

  handleCancel(): void {
    this.approvalForm.reset();
    this.onCancel.emit();
  }

  handleStatueChange(): void {
    if (this.stateValue === LicenseStatus.SUCCESS) {
      this.approvalCommentValue = `${this.i18n.getValue('i18n_license.agree')}`;
    } else {
      this.approvalCommentValue = '';
    }
  }

  updateStatus = (params: License): void => {
    if (this.stateValue === LicenseStatus.SUCCESS) {
      this.UpdateService.approvedLicense(params).subscribe(this.success, this.fail);
    }
    if(this.stateValue === LicenseStatus.FAIL){
      this.UpdateService.rejectedLicense(params).subscribe(this.success, this.fail);
    }
  }

  success = () => {
    this.isOkLoading = false;
    this.showMessage();
    this.approvalForm.reset();
    this.onOk.emit();
  }

  fail = (failed) => {
    this.isOkLoading = false;
    const mess = failed && failed.error && failed.error.message;
    this.message.create('error', `${mess}`);
  }

  showMessage = () => {
    if (this.stateValue === LicenseStatus.SUCCESS) {
      this.message.create('success', this.i18n.getValue('i18n_message.approvalAgree'), {
        nzDuration: 5000
      });
    } else {
      this.message.create('success', this.i18n.getValue('i18n_message.approvalFail'), {
        nzDuration: 5000
      });
    }
  }

}
