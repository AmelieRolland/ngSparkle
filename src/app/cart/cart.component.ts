import { Component, OnInit } from '@angular/core';
import { Article, CartItem, CreatedOrderResponse, Fabric, Item, Order, Service } from '../shared/entities/entities';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../shared/services/order.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [];
  total = 0;
  deliveryDate: string = '';
  deliverySlot: string = '';
  dropOffDate: string = '';

  saveDatesToSession(): void {
    const deliveryInfo = {
      deliveryDate: this.deliveryDate,
      deliverySlot: this.deliverySlot,
      dropOffDate: this.dropOffDate,
    };
    localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
  }

  loadDatesFromSession(): void {
    const savedDeliveryInfo = localStorage.getItem('deliveryInfo');
    if (savedDeliveryInfo) {
      const parsedInfo = JSON.parse(savedDeliveryInfo);
      this.deliveryDate = parsedInfo.deliveryDate || '';
      this.deliverySlot = parsedInfo.deliverySlot || '';
      this.dropOffDate = parsedInfo.dropOffDate || '';
    }
  }
  constructor(private orderService: OrderService,  private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadCartFromSession();
    this.calculateTotal();
  }

  loadCartFromSession(): void {
    const savedCart = localStorage.getItem('panier');
    if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        this.cart = parsedCart.map((item: any) => ({
            id: item.id || 0,
            quantity: item.quantity,
            price: item.price,
            subTotal: item.subTotal,
            articleName: item.articleName || '',
            fabricName: item.fabricName || '',
            serviceName: item.serviceName || '',
            article_id: item.article_id || 0, 
            fabric_id: item.fabric_id || 0,  
            service_id: item.service_id || 0, 
        }));
        console.log('Cart loaded from session:', this.cart);
    }
}

  increment(item: CartItem) {
    item.quantity++;
    this.updateSubTotal(item);
    this.saveCartToSession();
    this.calculateTotal();
  }

  decrement(item: CartItem) {
    item.quantity = item.quantity > 1 ? item.quantity - 1 : 1;
    this.updateSubTotal(item);
    this.saveCartToSession();
    this.calculateTotal();
  }

  updateSubTotal(item: CartItem) {
    item.subTotal = item.quantity * item.price;
    this.saveCartToSession();
  }

  calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + item.subTotal, 0);
  }

  removeItem(index: number) {
    this.cart.splice(index, 1)
    this.saveCartToSession()
    this.calculateTotal()
  }

  private saveCartToSession(): void {
    localStorage.setItem('panier', JSON.stringify(this.cart))
    console.log('Panier sauvegardé dans la session:', this.cart)
  }
  calculateTotalPrice(): number {
    return this.cart.reduce((total, item) => total + item.subTotal, 0);
  }

  validateOrder(): void {
    this.authService.getUserIRI().subscribe(
      (userIRI: string) => {
        // création des items
        const itemsObservables = this.cart.map(cartItem =>
          this.orderService.createItem(cartItem)
        );
  
        Promise.all(itemsObservables.map(obs => obs.toPromise())).then(createdItems => {
          console.log('Items créés:', createdItems);
  
          // extraction des IRIs / ids des items
          const itemIds = createdItems
            .map(item => `/api/items/${item['id']}`)
            .filter(id => id !== undefined);
  
          if (itemIds.length === 0) {
            console.error('Aucun item valide n\'a été créé.');
            return;
          }
  
          // création de la commande
          const order: Order = {
            price: this.calculateTotalPrice(),
            optionDelivery: true,
            deliveryDate: this.deliveryDate,
            status: '/api/statuses/17', //'en cours' par défaut
            user: userIRI,  
            delivery_slot: this.deliverySlot,
            drop_off_date: this.dropOffDate,
            order_date: new Date().toISOString(),
            items: itemIds
          };
  
          console.log('Order à envoyer:', order);
  
          this.orderService.createOrder(order).subscribe(
            (createdOrder: CreatedOrderResponse) => {
              const createdOrderId =`/api/orders/${createdOrder['id']}`; // je récupère l'ID de la commande créée
              console.log('Order créé:', createdOrderId);
  
              // Maj des items avec l'orderId
              const updateItemsObservables = createdItems.map(item => {
                const itemToUpdate = {
                  ...item,
                  order: createdOrderId // je lie la commande à chaque item
                };
                return this.orderService.updateItem(item['id'], itemToUpdate);
              });
  
              // maj des items
              Promise.all(updateItemsObservables.map(obs => obs.toPromise())).then(() => {
                console.log('Items mis à jour avec l\'orderId:', createdOrderId);
                this.router.navigate(['/paiement']);
              }).catch(error => {
                console.error('Erreur lors de la mise à jour des items:', error);
              });
            },
            error => {
              console.error('Erreur lors de la création de la commande:', error);
            }
          );
        }).catch(error => {
          console.error('Erreur lors de la création des items:', error);
        });
      },
      error => {
        console.error('Erreur lors de la récupération de l\'IRI utilisateur:', error);
        this.router.navigate(['/login'])
      }
    );
  }
  
}  
  






