import { Pipe, PipeTransform } from '@angular/core';
/*
 * Intercepting strings
 * Takes an intercept argument that defaults to 10.
 * Usage:
 *   value | ellipsis:intercept
*/
@Pipe({ name: 'ellipsis' })
export class EllipsisPipe implements PipeTransform {
    transform(value: string, intercept?: number): string {
        const interceptLength = intercept || 10;
        if (value && value.length > interceptLength) {
            const str = value.substring(0, interceptLength);
            const newStr = `${str}...`;
            return newStr;
        }
        return value;
    }
}