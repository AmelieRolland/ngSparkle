import { Injectable } from '@angular/core';
import { Article } from '../entities/entities';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  private apiUrl = 'http://127.0.0.1:8000/api/articles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  create(Article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, Article);
  }

  update(id: number, Article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, Article);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
