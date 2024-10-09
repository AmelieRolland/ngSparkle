import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { OrderService } from '../shared/services/order.service';
import { IUser } from '../shared/entities/entities';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth/auth.service';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css'
})
export class UserAccountComponent {

  username!: string ;
  orders: any[] = [];
  email: string = ''; 
  phone: string = ''; 
  userId: string = ''; 
  fullName: string = '';
  user: IUser | null = null;

  constructor(private authService: AuthService, private orderService: OrderService, private route: ActivatedRoute,  private userService: UserService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadUserDetails();
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
    const userInfo = this.authService.getUserInfo(); // Récupère les informations utilisateur du token
    if (userInfo) {
      this.username = userInfo.username; 
      
      // Utiliser l'email pour charger les détails de l'utilisateur
      this.userService.getAllUsers().subscribe(
        (users: IUser[]) => {
          const currentUser = users.find(user => user.email === this.username);
          if (currentUser) {
            this.userId = currentUser.id.toString(); 
            this.email = currentUser.email; 
            this.phone = currentUser.phone; 
            this.fullName = `${currentUser.name} ${currentUser.surname}`;
          } else {
            console.error('Utilisateur non trouvé.');
          }
        },
        error => {
          console.error('Erreur lors du chargement des utilisateurs:', error);
        }
      );
    } else {
      console.error('Utilisateur non connecté.');
    }
  }

}
