import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from '../entities/entities';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = 'http://127.0.0.1:8000/api/services';

  constructor(private http: HttpClient) { }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }
}
