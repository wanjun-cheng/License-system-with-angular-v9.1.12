import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule  }   from '@angular/common';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { I18nModule } from '../../i18n/i18n.module';
import { EllipsisPipe } from '../../common/ellipsis.pipe';
import { LicenseListRoutingModule } from './licenseList-routing.module';
import { LicenseListComponent } from './licenseList.component';
import { LicenseSearchComponent } from './search/search.component';
import { LicenseDetailComponent } from './detail/detail.component';
import { LicenseModalComponent } from './modal/modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    NzTableModule,
    NzDatePickerModule,
    NzDescriptionsModule,
    I18nModule,
    NzMessageModule,
    NzPaginationModule,
    NzModalModule,
    NzSelectModule,
    NzDividerModule,
    NzRadioModule,
    NzPopoverModule,
    NzIconModule,
    LicenseListRoutingModule,
  ],
  declarations: [
    LicenseListComponent,
    LicenseSearchComponent,
    LicenseDetailComponent,
    LicenseModalComponent,
    EllipsisPipe,
  ],
  // exports: [LicenseListComponent]
})
export class LicenseListModule {}
