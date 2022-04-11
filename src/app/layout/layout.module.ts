import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { LayoutComponent } from './layout.component';
import { I18nModule } from '../i18n/i18n.module';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzMenuModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzDropDownModule,
    I18nModule,
  ],
  declarations: [
    LayoutComponent,
  ],
  bootstrap: [ LayoutComponent ],
})
export class LayoutModule {
    constructor(router: Router) {
    }
}
