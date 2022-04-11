import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';

import { LoginComponent }    from './login/login.component';
import { I18nModule } from '../../i18n/i18n.module';

@NgModule({
  imports: [
    I18nModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzMessageModule,
    NzModalModule,
  ],
  declarations: [
    LoginComponent
  ]
})
export class AuthModule {}
