import { Pipe, PipeTransform, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { I18nService } from './i18n.service';

@Pipe({
    name: 'i18n',
    pure: false
})
export class I18nPipe implements PipeTransform, OnDestroy {
    i18nReadySub: Subscription;
    lastKey: string;
    lastValue: string;

    constructor(protected i18nService: I18nService) {
        this.i18nReadySub = this.i18nService.EVT_READY.subscribe(() => {
            // this.lastKey = key;
            this.lastValue = this.i18nService.getValue(this.lastKey);
        });
    }

    transform(key: string): any {
        if(this.i18nService.isReady()) {
            if(this.lastKey != key) {
                this.lastKey = key;
                this.lastValue = this.i18nService.getValue(key);
            }
        }
        else {
            this.lastKey = key;
            this.lastValue = ''
        }

        return this.lastValue;
    }

    ngOnDestroy() {
        this.i18nReadySub.unsubscribe();
    }
}
