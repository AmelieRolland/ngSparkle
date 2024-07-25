import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message } from '../entities/entities';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.apiUrl + '/messages';

  constructor(private http: HttpClient) { }

  getMessages(filter?: any): Observable<Message[]> {
    let params = new HttpParams();
    if (filter) {
      params = params.set('filter', filter);
    }
    return this.http.get<Message[]>(this.apiUrl, { params });
  }

  getMessage(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  postMessage(message: any): Observable<any> {
    return this.http.post(this.apiUrl, message);
  }

  markAsRead(messageId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${messageId}`, { isRead: true });
  }

  getUnreadMessagesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`);
  }
}
