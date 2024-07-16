import { Component, OnInit } from '@angular/core';
import { CartItem } from '../shared/entities/entities';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [];
  total = 0;

  ngOnInit(): void {
    this.loadCartFromSession();
    this.calculateTotal();
  }

  loadCartFromSession(): void {
    const savedCart = sessionStorage.getItem('panier');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      this.cart = parsedCart.map((item: any) => {
        if (item.service) {
          return {
            quantity: item.quantity,
            price: item.service.price,
            subTotal: item.quantity * item.service.price,
            articleName: item.article.articleName,
            fabricName: item.fabric.fabricName,
            serviceName: item.service.serviceName,
          };
        } else {
          return {
            quantity: item.quantity,
            price: 0, // Default price for items without service
            subTotal: 0, // Default subTotal for items without service
            articleName: item.articleName || '',
            fabricName: item.fabricName || '',
            serviceName: '', // Default service name for items without service
          };
        }
      });
      console.log('Cart loaded from session:', this.cart);
    }
  }

  addItem(pricePerUnit: number, articleName: string, fabricName: string, serviceName: string) {
    const newItem: CartItem = {
      quantity: 1,
      price: pricePerUnit,
      subTotal: pricePerUnit,
      articleName: articleName,
      fabricName: fabricName,
      serviceName: serviceName,
    };

    this.cart.push(newItem);
    this.saveCartToSession();
    this.calculateTotal();
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
  }

  calculateTotal() {
    this.total = this.cart.reduce((sum, item) => sum + item.subTotal, 0);
  }

  removeItem(index: number) {
    this.cart.splice(index, 1);
    this.saveCartToSession();
    this.calculateTotal();
  }

  private saveCartToSession(): void {
    sessionStorage.setItem('panier', JSON.stringify(this.cart));
    console.log('Panier sauvegardé dans la session:', this.cart);
  }
}
