import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { getCookie, clearCookie } from '../common/utils';


@Component({
  selector: 'page-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent {
  isCollapsed = false;
  userName: string = '';
  isManager: string = 'false';

  constructor(
    private router: Router,
  ) {
    this.userName = getCookie('loginEmail');
    this.isManager = getCookie('isManager');
  }

  onLogOut() {
    clearCookie('token');
    this.router.navigate(['/login']);
  }

}
