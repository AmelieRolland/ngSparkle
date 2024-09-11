import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../shared/services/order.service';
import { IUser, Order, OrderWithDetails, Status } from '../../shared/entities/entities';
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
  statuses: Status[] = []; 
  employees: IUser[] = []; 

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
            employee: order.employee ? this.orderService.getUserByIRI(order.employee).pipe(
              catchError(error => {
                console.error('Erreur lors de la récupération de l\'employé:', error);
                return of(null);
              })
            ) : of(null),
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
              statusDetails: result.status,
              assignedEmployee: result.employee,
              assignedEmployeeId: result.employee ? result.employee.id : null 
            })) as OrderWithDetails[];
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
      },
      (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      }
    );
  }
  

  
  updateOrderEmployee(orderId: string, employeeId: string | undefined): void {
    console.log('employeeId:', employeeId);
    if (employeeId) {
      const employeeUri = `/api/users/${employeeId}`; 
      console.log('employeeUri:', employeeUri);
      this.orderService.updateOrderEmployee(orderId, employeeUri).subscribe(() => {
        console.log(`Employé ${employeeId} assigné à la commande ${orderId}`);
        const order = this.orders.find(o => o.id === parseInt(orderId));
        if (order) {
          const selectedEmployee = this.employees.find(emp => emp.id === Number(employeeId));
          order.assignedEmployee = selectedEmployee;
        }
      });
    } else {
      console.error('Aucun employé sélectionné.');
    }
  }
  
  

  updateOrderStatus(orderId: string, statusId: string): void {
    this.orderService.updateOrderStatus(orderId, statusId).subscribe(() => {
    });
  }

  
}