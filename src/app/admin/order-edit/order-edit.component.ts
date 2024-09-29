import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { IUser, OrderWithDetails, Status } from '../../shared/entities/entities';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.css'
})
export class OrderEditComponent implements OnInit {
  order?: OrderWithDetails; // La commande peut être undefined au début
  employees: IUser[] = [];
  statuses: Status[] = [];

  selectedStatusId: string | undefined;


  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId); 
      this.loadEmployees();
      this.loadStatuses();
    }
  }

  loadOrder(orderId: string): void {
    this.orderService.getOrderById(orderId).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement de la commande:', error);
        return of(null);
      })
    ).subscribe(order => {
      if (order) {
        this.order = order;
        this.selectedStatusId = order.statusDetails?.id;
        console.log('Commande chargée:', this.order);
      }
    });
  }

  loadEmployees(): void {
    this.orderService.getAllEmployees().subscribe(employees => {
      this.employees = employees;
      console.log('Employés chargés:', employees);
    });
  }

  loadStatuses(): void {
    this.orderService.getAllStatuses().subscribe(statuses => {
      this.statuses = statuses;
      console.log('Statuts chargés:', statuses);
    });
  }

  updateOrder(): void {
    if (this.order) {
      this.orderService.updateOrderEmployee(this.order.id.toString(), `/api/users/${this.order.assignedEmployeeId}`).subscribe(() => {
        console.log('Employé mis à jour', this.order?.assignedEmployeeId);
      });

      this.orderService.updateOrderStatus(this.order.id.toString(), this.order.statusDetails.id.toString()).subscribe(() => {
        console.log('Statut mis à jour');
      });

      this.router.navigate(['/admin/commandes']);
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/admin/commandes']);
  }
}