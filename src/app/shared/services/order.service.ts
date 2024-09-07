import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CartItem, Item, Order } from '../entities/entities';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl + '/orders'; 
  private itemsApiUrl = environment.apiUrl + '/items';

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

  updateItem(itemId: string, item: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${itemId}`, item);
  }
  
  
}
