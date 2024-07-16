import { Component } from '@angular/core';
import { CartItem } from '../shared/entities/entities';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
})
export class CartComponent {
  cart: CartItem[] = [];
  total = 0;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state && navigation.extras.state['panier']) {
      this.cart = navigation.extras.state['panier'].map((item: any) => ({
        quantity: item.quantity,
        price: item.service.price,
        subTotal: item.quantity * item.service.price,
        articleName: item.article.articleName,
        fabricName: item.fabric.fabricName,
        serviceName: item.service.serviceName,
      }));
    }
    this.calculateTotal();
  }

  increment(item: CartItem) {
    item.quantity++;
    this.updateSubTotal(item);
    this.calculateTotal();
  }

  decrement(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateSubTotal(item);
      this.calculateTotal();
    }
  }

  updateSubTotal(item: CartItem) {
    item.subTotal = item.quantity * item.price;
  }

  calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + item.subTotal, 0);
  }

  removeItem(item: CartItem) {
    const index = this.cart.indexOf(item);
    if (index > -1) {
        this.cart.splice(index, 1);
        this.calculateTotal(); 
    }
}



  
}
