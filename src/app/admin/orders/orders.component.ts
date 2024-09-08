import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { Order, OrderWithDetails } from '../../shared/entities/entities';
import { CommonModule } from '@angular/common';
import { of, forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: OrderWithDetails[] = []; 
  statuses: any[] = []; 
  employees: any[] = []; 

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadStatuses();
    this.loadEmployees();
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des commandes:', error);
        return throwError(() => new Error('Erreur lors du chargement des commandes'));
      })
    ).subscribe(
      (orders: Order[]) => {
        const requests = orders.map(order =>
          forkJoin({
            user: this.orderService.getUserByIRI(order.user).pipe(
              catchError(error => {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
                return of(null); 
              })
            ),
            status: this.orderService.getStatusByIRI(order.status).pipe(
              catchError(error => {
                console.error('Erreur lors de la récupération du statut:', error);
                return of(null); 
              })
            ),
            order: of(order)
          })
        );

        forkJoin(requests).pipe(
          catchError(error => {
            console.error('Erreur lors du chargement des détails:', error);
            return throwError(() => new Error('Erreur lors du chargement des détails'));
          })
        ).subscribe(
          (results: any[]) => {
            this.orders = results.map(result => ({
              ...result.order,
              userDetails: result.user,
              statusDetails: result.status
            })) as OrderWithDetails[];
            console.log('Commandes avec détails:', this.orders);
          }
        );
      }
    );
  }

  loadStatuses(): void {
    this.orderService.getAllStatuses().subscribe(
      (statuses) => {
        this.statuses = statuses;
      },
      (error) => {
        console.error('Erreur lors du chargement des statuts:', error);
      }
    );
  }

  loadEmployees(): void {
    this.orderService.getAllEmployees().subscribe(
      (employees) => {
        this.employees = employees;
        console.log('Employés chargés:', this.employees);
      },
      (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      }
    );
  }
  

  updateOrderStatus(orderId: string, newStatusURI: string): void {
    this.orderService.updateOrderStatus(orderId, newStatusURI).subscribe(
      () => {
        console.log('Statut mis à jour');
        this.loadOrders(); 
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    );
  }

  updateOrderEmployee(orderId: string, employeeId: string): void {
    this.orderService.updateOrderEmployee(orderId, employeeId).subscribe(
      () => {
        console.log('Employé assigné mis à jour');
        this.loadOrders(); 
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'employé:', error);
      }
    );
  }

  
}