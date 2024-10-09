import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '../../entities/entities';
import { map, catchError } from 'rxjs/operators';



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
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token'); 
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
    localStorage.removeItem('panier');
    this.router.navigate(['/login']);
  }

  getUserIRI(): Observable<string> {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      console.log('Token décodé:', decodedToken);
      const username = decodedToken.username; 
      if (username) {
        return this.http.get<IUser[]>(`${this.url}/users?username=${username}`).pipe(
          map((users: IUser[]) => {
            const user = users.find(u => u.userIdentifier === username);
            if (user && user.id) {
              return `/api/users/${user.id}`; 
            }
            throw new Error('Utilisateur non trouvé');
          }),
          catchError(err => throwError('Erreur lors de la récupération de l\'utilisateur'))
        );
      }
    }
    return throwError('Utilisateur non connecté ou token invalide.');
  }
}
  

