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

  getById(id: number): Observable<Fabric> {
    return this.http.get<Fabric>(`${this.apiUrl}/${id}`);
  }

  create(fabric: Fabric): Observable<Fabric> {
    return this.http.post<Fabric>(this.apiUrl, fabric);
  }

  update(fabric: Fabric): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${fabric.id}`, fabric);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
