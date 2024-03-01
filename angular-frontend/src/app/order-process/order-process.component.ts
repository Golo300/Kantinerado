// order-process.component.ts
import { Component } from '@angular/core';
import { Order } from '../OrderProcess';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrls: ['./order-process.component.css']
})
export class OrderProcessComponent {
  selectedDishes: Order[] = [];

  receiveSelectedDishes(selectedDishes: Order[]) {
    this.selectedDishes = selectedDishes;
    console.log("Empfangene ausgewählte Gerichte:", this.selectedDishes);
  }
}
