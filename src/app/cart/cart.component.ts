import { Component } from '@angular/core';
import { CartItem } from '../shared/entities/entities';
import { CommonModule, NgFor } from '@angular/common';


@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
})
export class CartComponent {
  cart: CartItem[] = [
    {
      quantity: 1,
      price: 16.5,
      subTotal: 16.5, 
    }
  ];

  total = 0; 

  constructor() {
    this.calculateTotal(); 
  }

  addItem(pricePerUnit: number) {
    const newItem: CartItem = {
      quantity: 1,
      price: pricePerUnit,
      subTotal: pricePerUnit, 
    };

    this.cart.push(newItem);
    this.calculateTotal(); // Recalculer le total après ajout
  }

  increment(item: CartItem) {
    item.quantity++;
    this.updateSubTotal(item);
    this.calculateTotal(); // Recalculer le total après modification
  }

  decrement(item: CartItem) {
    item.quantity = item.quantity > 1 ? item.quantity - 1 : 1;
    this.updateSubTotal(item);
    this.calculateTotal(); // Recalculer le total après modification
  }

  updateSubTotal(item: CartItem) {
    item.subTotal = item.quantity * item.price;
  }

  calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + item.subTotal, 0);
  }
}









