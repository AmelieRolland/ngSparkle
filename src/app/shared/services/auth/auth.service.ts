import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private authenticated = false;

  login(email: string, password: string): boolean {
    if (email === 'user@test.com' && password === 'test') {
      this.authenticated = true;
      return true;
    } else {
      this.authenticated = false;
      return false;
    }
  }

  logout() {
    this.authenticated = false;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }
}
