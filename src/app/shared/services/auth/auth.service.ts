import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

export interface IToken {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(credentials: { username: string; password: string }): Observable<IToken> {
    return this.http.post<IToken>(`${this.url}/login_check`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  isLogged(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  getUserInfo(){

  }
}
