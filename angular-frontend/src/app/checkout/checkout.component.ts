import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../OrderProcess';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  selectedDishes: Order[] = [];

  constructor(private orderService : OrderService) {}

  ngOnInit( ): void {
    this.selectedDishes = this.orderService.getLastProducts();
    
    this.orderService.selectedProduct$.subscribe((value) => {
      this.selectedDishes = value;
    });
  }
}
