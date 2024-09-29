import { Component, OnInit, signal } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { IUser, OrderWithDetails, Status } from '../../shared/entities/entities';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders = signal<OrderWithDetails[]>([]);
  statuses = signal<Status[]>([]);
  employees = signal<IUser[]>([]);
  isLoading = signal<boolean>(true);
  private usersCache: { [iri: string]: IUser } = {}; 
  private statusesCache: { [iri: string]: Status } = {}; 

  constructor(private orderService: OrderService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des commandes:', error);
        return throwError(() => new Error('Erreur lors du chargement des commandes'));
      })
    ).subscribe((orders) => {
      const userRequests: { [key: string]: any } = {};
      const statusRequests: { [key: string]: any } = {};
      const employeeRequests: { [key: string]: any } = {};

      orders.forEach(order => {
        if (!this.usersCache[order.user]) {
          userRequests[order.user] = this.orderService.getUserByIRI(order.user).pipe(
            catchError(() => of(null))
          );
        }
        if (!this.statusesCache[order.status]) {
          statusRequests[order.status] = this.orderService.getStatusByIRI(order.status).pipe(
            catchError(() => of(null))
          );
        }
        if (order.employee && !this.usersCache[order.employee]) {
          employeeRequests[order.employee] = this.orderService.getUserByIRI(order.employee).pipe(
            catchError(() => of(null))
          );
        }
      });

      forkJoin({
        users: forkJoin(userRequests),
        statuses: forkJoin(statusRequests),
        employees: forkJoin(employeeRequests)
      }).pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des détails:', error);
          return throwError(() => new Error('Erreur lors du chargement des détails'));
        })
      ).subscribe(({ users, statuses, employees }) => {
        Object.assign(this.usersCache, users);
        Object.assign(this.statusesCache, statuses);
        Object.assign(this.usersCache, employees);

        const detailedOrders = orders.map(order => ({
          ...order,
          userDetails: this.usersCache[order.user],
          statusDetails: this.statusesCache[order.status],
          assignedEmployeeName: this.usersCache[order.employee]?.surname || 'Non assigné',
        }));

        this.orders.set(detailedOrders as OrderWithDetails[]);
        this.isLoading.set(false); 
      });
    });
  }

  modifyOrder(orderId: string): void {
    this.router.navigate(['/admin/commandes/edit', orderId]);
  }

  userHasRole(role: string): boolean {
    const user = this.authService.getUserInfo();
    return user && user.roles.includes(role);
  }

  deleteOrder(orderId: number): void {
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cette commande ?');
  
    if (confirmDelete) {
      this.orderService.deleteOrder(orderId).subscribe(() => {
        console.log('Commande supprimée');
        const updatedOrders = this.orders().filter(order => order.id !== orderId);
        this.orders.set(updatedOrders);
      }, error => {
        console.error('Erreur lors de la suppression de la commande:', error);
      });
    }
  }
}
