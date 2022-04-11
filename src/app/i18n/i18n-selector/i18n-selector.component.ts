import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { I18nService } from '../i18n.service';
import { Lang } from '../Lang';

@Component({
    selector: 'i18n-selector',
    templateUrl: './i18n-selector.component.html',
    styleUrls: ['./i18n-selector.component.css']
})
export class I18nSelectorComponent implements OnInit, OnDestroy {
    private i18nReadySub: Subscription;
    public langList: Array<Lang>;
    public newLang: Lang;

    constructor(private i18n: I18nService) { }

    ngOnInit() {
        this.langList = this.i18n.getLangs();
        this.i18nReadySub = this.i18n.EVT_READY.subscribe(() => {
            this.resetNewLang();
            this.i18n.LANG_CHANGE.emit(this.newLang);
        });
        this.resetNewLang();
    }

    itemClickHandle(item: Lang) {
        if (this.newLang.value === item.value) {
            return;
        }
        this.i18n.setLanguage(item);
    }

    resetNewLang() {
        this.newLang = this.i18n.getCurrentLang();
    }

    ngOnDestroy(): void {
        this.i18nReadySub.unsubscribe();
    }
}
