import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import e from 'express';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Fabric } from '../entities/entities';

@Injectable({
  providedIn: 'root'
})
export class FabricService {

  private apiUrl = environment.apiUrl +'/fabrics';

  constructor(private http: HttpClient) { }

  getFabrics(): Observable<Fabric[]> {
    return this.http.get<Fabric[]>(this.apiUrl);
  }
}
