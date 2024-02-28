import { Component } from '@angular/core';
import { Order } from '../OrderProcess';

@Component({
  selector: 'app-order-process',
  templateUrl: './order-process.component.html',
  styleUrl: './order-process.component.css'
})
export class OrderProcessComponent {
  selectedDishes: Order[] = [];

  // Methode zum Empfangen der ausgewählten Gerichte von der mealplan-order Komponente
  receiveSelectedDishes(selectedDishes: any[]) {
    this.selectedDishes = selectedDishes;
  }
}
