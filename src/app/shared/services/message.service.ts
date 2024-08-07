import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message } from '../entities/entities';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.apiUrl + '/messages';
  private unreadMessagesCount = new BehaviorSubject<number>(0);

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
    const headers = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json'
    });
    return this.http.patch(`${this.apiUrl}/${messageId}`, { read: true }, { headers });
  }

  getUnreadMessagesCount(): Observable<number> {
    return this.unreadMessagesCount.asObservable();
  }

  updateUnreadMessagesCount(count: number): void {
    this.unreadMessagesCount.next(count);
  }

  deleteMessage(messageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${messageId}`);
  }
}
