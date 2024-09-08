import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../entities/entities';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getUserWithOrders(userId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/users/${userId}`);
  }
  
   register(user:IUser): Observable<any> {
    return this.http.post(`${this.url}/users`, user);
  }
  
}