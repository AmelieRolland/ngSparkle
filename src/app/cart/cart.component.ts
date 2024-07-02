import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
})
export class CartComponent {
  quantity = signal(1);
  price = signal(16.5);
  total = computed(() => this.quantity() * this.price());

  increment() {
    this.quantity.set(this.quantity() + 1);
  }

  decrement() {
    this.quantity.set(this.quantity() > 1 ? this.quantity() - 1 : 1);
  }
}


