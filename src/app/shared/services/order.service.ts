import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CartItem, Item, IUser, Order } from '../entities/entities';
import { environment } from '../../../environments/environment';
import { map, tap, switchMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl + '/orders'; 
  private itemsApiUrl = environment.apiUrl + '/items';
  private usersApiUrl = environment.apiUrl + '/users';
  private statusesApiUrl = environment.apiUrl + '/statuses';
  private articlesApiUrl = environment.apiUrl + '/articles'; // Pour les articles
  private fabricsApiUrl = environment.apiUrl + '/fabrics';   // Pour les matières
  private servicesApiUrl = environment.apiUrl + '/services'; // Pour les services

  constructor(private http: HttpClient) {}

  convertCartItemToItem(cartItem: CartItem): Item {
    return {
      id: 0, 
      article_id: cartItem.article_id,
      fabric_id: cartItem.fabric_id,
      service_id: cartItem.service_id,
      quantity: cartItem.quantity,
      price: cartItem.price
    };
  }

  createItem(cartItem: CartItem): Observable<any> {
    if (!cartItem.article_id || !cartItem.fabric_id || !cartItem.service_id) {
      console.error('IDs manquants dans cartItem:', cartItem);
      return throwError(() => new Error('IDs manquants dans cartItem'));
    }
  
    const item = {
      article: `/api/articles/${cartItem.article_id}`,
      fabric: `/api/fabrics/${cartItem.fabric_id}`,
      service: `/api/services/${cartItem.service_id}`,
      quantity: cartItem.quantity,
      price: cartItem.price
    };
  
    return this.http.post('http://localhost:8000/api/items', item);
  }
  
  createOrder(order: Order): Observable<any> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateItem(itemId: string, itemData: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json'
    });
    return this.http.patch(`${this.itemsApiUrl}/${itemId}`, itemData, { headers });
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserByIRI(userIRI: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000${userIRI}`);
  }

  getStatusByIRI(statusIRI: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000${statusIRI}`);
  }

  getAllStatuses(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8000/api/statuses');
  }

  getAllEmployees(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.usersApiUrl).pipe(
      tap(users => console.log('Utilisateurs reçus:', users)),
      map(users => users.filter(user => user.roles && Array.isArray(user.roles) && user.roles.includes('ROLE_EMPLOYEE')))
    );
  }

  updateOrderStatus(orderURI: string, newStatusIRI: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json'
    });
    return this.http.patch<any>(`${this.apiUrl}/${orderURI}`, { status: newStatusIRI }, { headers });
  }

  updateOrderEmployee(orderId: string, employeeId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json'
    });
    return this.http.patch<any>(`${this.apiUrl}/${orderId}`, { employee: `/api/users/${employeeId}` }, { headers });
  }

  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`);
  }

  getItemByURI(itemUri: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000${itemUri}`).pipe(
      switchMap(item => {
        const articleRequest = this.http.get<any>(`http://localhost:8000${item.article}`);
        const fabricRequest = this.http.get<any>(`http://localhost:8000${item.fabric}`);
        const serviceRequest = this.http.get<any>(`http://localhost:8000${item.service}`);

        return forkJoin({
          article: articleRequest,
          fabric: fabricRequest,
          service: serviceRequest
        }).pipe(
          map(details => ({
            ...item,
            articleName: details.article.articleName,
            fabricName: details.fabric.fabricName,
            serviceName: details.service.serviceName
          }))
        );
      })
    );
  }
}
