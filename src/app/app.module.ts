import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';

import { AppComponent }            from './app.component';
import { LayoutModule }            from './layout/layout.module';
import { PagesModule }              from './pages/pages.module';

import { IconsProviderModule } from './icons-provider.module';
import { HttpClientModule } from '@angular/common/http';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import zh from '@angular/common/locales/zh';
import { registerLocaleData, HashLocationStrategy, LocationStrategy } from '@angular/common';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SysHttpInterceptor } from './common/http-interceptor';
import { I18nModule } from './i18n/i18n.module';

import { environment } from '../environments/environment';
import { BASE_PATH } from '../apis/license/target/generated-sources/swagger/variables';
import { ApiModule } from '../apis/license/target/generated-sources/swagger/api.module';


registerLocaleData(zh);

@NgModule({
  imports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    HttpClientModule,
    LayoutModule,
    PagesModule,
    I18nModule.forRoot(),
    ApiModule,
  ],
  declarations: [
    AppComponent,
  ],
  bootstrap: [ AppComponent ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: BASE_PATH, useValue: environment.API_BASE_PATH },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: SysHttpInterceptor, multi: true }
  ]
})
export class AppModule {
  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    // Use a custom replacer to display function names in the route configs
    // const replacer = (key, value) => (typeof value === 'function') ? value.name : value;

    // console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  }
}
