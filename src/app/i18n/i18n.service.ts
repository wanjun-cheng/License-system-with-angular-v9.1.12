import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { en_US, zh_CN, NzI18nService } from 'ng-zorro-antd/i18n';
import { LocalObjectData } from '../common/constant';
import { Lang } from './Lang';

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    public EVT_READY: EventEmitter<any> = new EventEmitter();
    public LANG_CHANGE: EventEmitter<any> = new EventEmitter();
    private serviceState = false;

    protected i18nPath = '/assets/i18n';
    public lang: Lang;
    protected langs: Array<Lang> = [
        { label: '中文简体', value: 'zh_CN' },
        { label: 'English', value: 'en_US' }
    ];

    protected data = {};
    private listOfLocalObjectData: any = [];
    private listOfLocalArrayData: any = [];

    constructor(protected http: HttpClient, private nzI18n: NzI18nService) {
        this.init();
    }

    public init() {
        this.setConfPath(this.i18nPath);

        const newNavigator: any = navigator;
        const lang = newNavigator.language || newNavigator.browserLanguage;
        if (/^zh/.test(lang)) {
            this.setLanguage(this.langs[0]);
        } else {
            this.setLanguage(this.langs[1]);
        }
    }

    public onReady(func: any): Subscription {
        return this.EVT_READY.subscribe(() => {
            func();
        });
    }

    public isReady(): boolean {
        return this.serviceState;
    }

    public setConfPath(path: string) {
        if (path === null || path === undefined) {
            return;
        }

        this.i18nPath = path;
    }

    public setLanguage(lang: Lang) {
        if (this.langs.findIndex(v => v.value === lang.value) === -1) {
            return;
        }

        this.lang = lang;
        this.serviceState = false;

        this.reload();
    }

    public getValue(key: string): string {
        const val = this.data[key];
        if (val === null || val === undefined) {
            return key;
        }

        return val;
    }

    private reload() {
        this.serviceState = false;
        const i18nFile = this.i18nPath + '/' + this.lang.value + '.json';
        this.http.get(i18nFile).subscribe(
            conf => {
                this.data = conf;
                this.serviceState = true;
                switch (this.lang.value) {
                    case 'en_US':
                        this.nzI18n.setLocale(en_US);
                        break;
                    case 'zh_CN':
                        this.nzI18n.setLocale(zh_CN);
                        break;
                }

                this.listOfLocalObjectData.forEach(localData => {
                    this.updateLocalObjectData(localData);
                });
                this.EVT_READY.emit(this.lang.value);
            },
            failed => {
                console.log(failed);
            }
        );
    }

    public getLangs(): Array<Lang> {
        return this.langs;
    }

    public getCurrentLang(): Lang {
        return this.lang;
    }

    public registerLocaleObjectData(localData: LocalObjectData): void {
        if (this.isReady()) {
            this.updateLocalObjectData(localData);
            this.listOfLocalObjectData.push(localData);
            return;
        }
        const readySub = this.EVT_READY.subscribe(() => {
            this.updateLocalObjectData(localData);
            this.listOfLocalObjectData.push(localData);
            readySub.unsubscribe();
        });
    }

    private updateLocalObjectData(localData: LocalObjectData) {
        const backupFilters = [...localData.filters];
        backupFilters.forEach(item => {
            if (item.text !== undefined) {
                item.text = this.getValue(`${localData.i18nPrefix}.${item.value}`);
            }
            if (item.label !== undefined) {
                item.label = this.getValue(`${localData.i18nPrefix}.${item.value}`);
            }
        });
        localData.filters = backupFilters;
    }
}
