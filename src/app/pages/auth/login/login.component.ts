import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { LoginService } from '../../../../apis/license/target/generated-sources/swagger/api/login.service';
import { getCookie } from './../../../common/utils';
import { I18nService } from '../../../i18n/i18n.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  emailValue: string = '';

  constructor(
    private fb: FormBuilder,
    public router: Router,
    public LoginService: LoginService,
    private message: NzMessageService,
    private modal: NzModalService,
    private i18n: I18nService
    ) {
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
    if(getCookie('token')){
      this.router.navigate(['/license/list']);
    }
    const emial = getCookie('loginEmail');
    if(emial){
      this.emailValue = emial;
    }
  }

  onSubmit() {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.value.email;
    
    this.LoginService.login(email).subscribe(
      () => {
        this.modal.success({
          nzTitle: this.i18n.getValue('i18n_message.emailSendValidate'),
        });
      },
      failed => {
        const mess = failed && failed.error && failed.error.message;
        this.message.create('error', `${mess}`);
      }
    );
  }

}
