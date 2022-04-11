import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { I18nPipe } from './i18n.pipe';
import { I18nService } from './i18n.service';
import { I18nSelectorComponent } from './i18n-selector/i18n-selector.component';

@NgModule({
    imports: [
        CommonModule,
        NzDropDownModule,
        NzIconModule,
        NzMenuModule,
    ],
    declarations: [
        I18nPipe,
        I18nSelectorComponent
    ],
    providers: [
    ],
    exports: [
        I18nPipe,
        I18nSelectorComponent
    ]
})
export class I18nModule {

    constructor(@Optional() @SkipSelf() parentModule: I18nModule) {
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: I18nModule,
            providers: [I18nService]
        };
    }
}
