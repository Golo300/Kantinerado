import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { FullOrder } from '../Mealplan';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  pendingOrders: FullOrder[] = [];
  pastOrders: FullOrder[] = [];
  todayOrders: FullOrder[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    const today = new Date();

    // Datum von gestern
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Datum von morgen
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.orderService.getAllOrders()
      .pipe(
        tap((orders: FullOrder[]) => {
          this.todayOrders = orders.filter(order => this.isToday(new Date(order.date)));
          this.pendingOrders = orders.filter(order => new Date(order.date) > today);
          this.pastOrders = orders.filter(order => new Date(order.date) < yesterday);
        })
      )
      .subscribe();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  }

  calculateTotalPrice(orders: FullOrder[]): number {
    return orders.reduce((total, order) => total + order.dish.price, 0);
  }

  formatDate(date: Date): string {
    if (!date) {
      return ''; // Rückgabe eines leeren Strings, wenn das Datum ungültig ist
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Intl.DateTimeFormat('de-DE', options).format(date);
  }
}
