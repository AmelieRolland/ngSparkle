import { Component, OnInit } from '@angular/core';
import { Article, CartItem, Fabric, Item, Order, Service } from '../shared/entities/entities';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
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
    sessionStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
  }

  loadDatesFromSession(): void {
    const savedDeliveryInfo = sessionStorage.getItem('deliveryInfo');
    if (savedDeliveryInfo) {
      const parsedInfo = JSON.parse(savedDeliveryInfo);
      this.deliveryDate = parsedInfo.deliveryDate || '';
      this.deliverySlot = parsedInfo.deliverySlot || '';
      this.dropOffDate = parsedInfo.dropOffDate || '';
    }
  }
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadCartFromSession();
    this.calculateTotal();
  }

  loadCartFromSession(): void {
    const savedCart = sessionStorage.getItem('panier');
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
            article_id: item.article_id || 0, // Assurez-vous de restaurer l'identifiant de l'article
            fabric_id: item.fabric_id || 0,   // Assurez-vous de restaurer l'identifiant du tissu
            service_id: item.service_id || 0, // Assurez-vous de restaurer l'identifiant du service
        }));
        console.log('Cart loaded from session:', this.cart);
    }
}



  // addItem(article: Article, fabric: Fabric, service: Service) {
  //   console.log('Article:', article);
  //   console.log('Fabric:', fabric);
  //   console.log('Service:', service);

  //   if (!article.id || !fabric.id || !service.id) {
  //     console.error('Invalid item: article, fabric, or service is missing an ID.');
  //     return;
  //   }

  //   const pricePerUnit = service.price * article.coeff * fabric.coeff;
  //   const newItem: CartItem = {
  //     id: this.cart.length + 1,
  //     quantity: 1,
  //     price: pricePerUnit,
  //     subTotal: pricePerUnit,
  //     articleName: article.articleName,
  //     fabricName: fabric.fabricName,
  //     serviceName: service.serviceName,
  //     article_id: article.id,
  //     fabric_id: fabric.id,
  //     service_id: service.id,
  //   };

  //   console.log( newItem); 

  //   this.cart.push(newItem);
  //   this.saveCartToSession();
  //   this.calculateTotal();
  // }




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
    sessionStorage.setItem('panier', JSON.stringify(this.cart))
    console.log('Panier sauvegardé dans la session:', this.cart)
  }
  calculateTotalPrice(): number {
    return this.cart.reduce((total, item) => total + item.subTotal, 0);
  }

  validateOrder(): void {
    // création des items
    const itemsObservables = this.cart.map(cartItem =>
      this.orderService.createItem(cartItem)
    );
  

    Promise.all(itemsObservables.map(obs => obs.toPromise())).then(createdItems => {
      console.log('Items créés:', createdItems)
  
      // extraction des IRIs / ids des items
      const itemIds = createdItems
    .map(item => `/api/items/${item['id']}`)
    .filter(id => id !== undefined)
  
      if (itemIds.length === 0) {
        console.error('Aucun item valide n\'a été créé.');
        return;
      }
  
      // creation de l'order
      const order: Order = {
        price: this.calculateTotalPrice(),
        optionDelivery: true,
        deliveryDate: this.deliveryDate || "",
        status: '/api/statuses/17', 
        user: '/api/users/15', 
        delivery_slot: this.deliverySlot || "",
        drop_off_date: this.dropOffDate || "",
        order_date: new Date().toISOString(),
        items: itemIds
      };
  
      console.log('Order à envoyer:', order);
  
      this.orderService.createOrder(order).subscribe(
        (createdOrder: any) => {
          const createdOrderId = createdOrder['@id']; // Récupérer l'ID de la commande créée
  
          // Maj des items avec l'orderId
          const updateItemsObservables = createdItems.map(item => {
            const itemToUpdate = {
              ...item,
              order: createdOrderId //ici je lie la commande à chaque item
            };
            return this.orderService.updateItem(item['@id'], itemToUpdate);
          });
  
          // maj des items
          Promise.all(updateItemsObservables.map(obs => obs.toPromise())).then(() => {
            console.log('Items mis à jour avec l\'orderId:', createdOrderId);
          }).catch(error => {
            console.error('Erreur lors de la mise à jour des items:', error);
          });
        },
        error => {
          console.error('Erreur lors de la création de la commande:', error);
          if (error.error) {
            console.error('Détail de l\'erreur:', error.error);
          }
        }
      );
    }).catch(error => {
      console.error('Erreur lors de la création des items:', error);
    });
  }
}  
  






