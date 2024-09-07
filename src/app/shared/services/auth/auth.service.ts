import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';


export interface IToken {
  token: string;
  exp:number 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<IToken> {
    return this.http.post<IToken>(`${this.url}/login_check`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token); // Utilise localStorage pour stocker le token
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Récupère le token depuis localStorage
  }

  isLogged(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decodedToken = jwtDecode<IToken>(token);
      return decodedToken.exp > Date.now() / 1000; 
    } catch (error) {
      return false;
    }
  }

  getUserInfo() {
    const token = this.getToken(); 
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken;
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}