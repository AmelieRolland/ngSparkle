import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../shared/services/order.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: any;  
  items: any[] = [];  

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(orderId);  
    }
  }

  loadOrder(orderId: string): void {
    this.orderService.getOrderById(orderId).subscribe(order => {
      this.order = order;  
      this.loadItems(order.items); 
    });
  }

  loadItems(itemUris: string[]): void {
    const itemRequests = itemUris.map(uri => this.orderService.getItemByURI(uri));

    forkJoin(itemRequests).subscribe(items => {
      this.items = items.map(item => ({
        ...item,
        articleName: item.articleName,
        serviceName: item.serviceName,
        fabricName: item.fabricName
      }));
    });
  }
}