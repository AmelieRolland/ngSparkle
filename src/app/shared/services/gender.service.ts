import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Gender } from '../entities/entities';

@Injectable({
  providedIn: 'root'
})
export class GenderService {
  private apiUrl = 'http://127.0.0.1:8000/api/genders'; // Remplacez par votre URL API

  constructor(private http: HttpClient) { }

  getGenders(): Observable<Gender[]> {
    return this.http.get<Gender[]>(this.apiUrl);
  }
}
