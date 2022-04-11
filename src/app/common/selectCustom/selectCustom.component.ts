import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

import { CUSTOM } from '../constant';


@Component({
    selector: 'select-custom',
    templateUrl: './selectCustom.component.html',
    styleUrls: []
})
export class SelectCustomComponent implements OnInit {
    // myGroup: FormGroup;
    showCustom: boolean = false;

      @Output() handleChange = new EventEmitter<any>();
    //   @Input() form: FormGroup;
    @Input() selectList;
    @Input() name: string = 'permitDuration';
    @Input() customName: string = 'permitDays';

    constructor(
        private fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        const name = this.name;
        //  this.myGroup = this.fb.group({
        //     [name]: [null, Validators.required],
        //   });
    }

    validateInt(control: FormControl): { [s: string]: boolean } {
        const reg = /^[1-9]+[0-9]*$/
        if (!control.value) {
            return { error: true, required: true };
        } else if (!reg.test(control.value)) {
            return { int: true, error: true };
        };
        return {};
    }

    handleDurationChange(value: string) {
        console.log(value)
        if (value === CUSTOM) {
            this.showCustom = true;
            // this.myGroup.addControl(this.customName, new FormControl(null, [this.validateInt]));
        } else {
            this.showCustom = false;
            // this.myGroup.removeControl(this.customName);
            this.handleChange.emit(value);
        }
    }

    handleInputChange(value) {
        this.handleChange.emit(value);
    }

}
