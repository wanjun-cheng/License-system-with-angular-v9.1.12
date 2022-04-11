import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule  }   from '@angular/common';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { I18nModule } from '../i18n/i18n.module';
import { PagesRoutingModule } from './pages-routing.module';
import { AuthModule } from './auth/auth.module';
import { LicenseApplyComponent } from './licenseApply/licenseApply.component';
import { SelectCustomComponent } from '../common/selectCustom/selectCustom.component';


@NgModule({
  imports: [
    CommonModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzDatePickerModule,
    PagesRoutingModule,
    I18nModule,
    NzSelectModule,
    NzMessageModule,
    NzIconModule,
    NzDividerModule,
  ],
  declarations: [
    LicenseApplyComponent,
    SelectCustomComponent,
  ],
  exports: []
})
export class PagesModule { }