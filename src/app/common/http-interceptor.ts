import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpResponseBase, HttpErrorResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { getCookie, clearCookie } from './utils';


export class JsonResult<T> {
  data?: T;
  success: boolean;
  info?: string;
  total?: number;
  result?: string;
}

@Injectable()
export class SysHttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private message: NzMessageService,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = getCookie('token');
    req = req.clone({ setHeaders: { 'token': token } });
    return next.handle(req).pipe(
      tap(event => {}, err => {
        if (err instanceof HttpErrorResponse) {
          const error = err.error;
          if (error && error.code) {
            if ((error.code == 'FAIL_TOKEN_EXPIRED') || (error.code ==  'FAIL_TOKEN_NULL')) {
              clearCookie('token');
              this.router.navigate(['/login']);
            }
            return;
          } else if (err.status === 500) {
            this.message.create('error', `${err.statusText}`);
          } else if (err.status === 200) {
            return err;
          }
        }
      })

      // 错误信息返回不到请求的subscribe
      // catchError((err: HttpEvent<any>) => {
      //   if (err instanceof HttpErrorResponse) {
      //     const error = err.error;
      //     if (error && error.code) {
      //       if (error.code == 'FAIL_TOKEN_EXPIRED' || error.code == 'FAIL_TOKEN_NULL') {
      //         clearCookie('token');
      //         this.router.navigate(['/login']);
      //       } else {
      //         this.message.create('error', `${error.message}`);
      //       }
      //     } else if (err.status === 500) {
      //       this.message.create('error', `${err.statusText}`);
      //     }
      //     return of(err);
      //   }
      // })

      // map((data: HttpEvent<any>) => {
      //   if (data instanceof HttpResponseBase) {
      //     const rp = <HttpResponse<JsonResult<any>>> data;
      //     console.log(rp);
      //     if(rp.body.result && rp.body.result == 'FAIL_TOKEN_EXPIRED') {
      //       // clearCookie('token');
      //       this.router.navigate(['/login']);
      //       return null;
      //     };
      //   }
      //   return data;
      // }), 
    )
  }
}
