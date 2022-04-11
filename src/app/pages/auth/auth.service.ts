import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string;

  constructor() {}

  public login() {}

  logout(): void {
    this.isLoggedIn = false;
  }
}
