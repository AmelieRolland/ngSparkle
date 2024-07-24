import { Injectable } from '@angular/core';
import { Article, NewArticle } from '../entities/entities';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  private apiUrl = environment.apiUrl +'/articles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  create(article: NewArticle): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  update(id: number, Article: Article): Observable<Article> {
    return this.http.put<Article>(`${this.apiUrl}/${id}`, Article);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
