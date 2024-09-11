import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { OrderService } from '../shared/services/order.service';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css'
})
export class UserAccountComponent {

  username: string = 'Utilisateur';
  orders: any[] = [];
  email: string = 'example@example.com'; 
  phone: string = '0000000000';
  userId: string = ''; 

  constructor(private orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') || '';
      this.loadOrders();
      this.loadUserDetails();
    });
  }

  loadOrders(): void {
    if (this.userId) {
      this.orderService.getUserOrders(this.userId).subscribe(
        (orders: any[]) => {
          this.orders = orders;
        },
        error => {
          console.error('Erreur lors du chargement des commandes:', error);
        }
      );
    }
  }

  loadUserDetails(): void {

  }
}
