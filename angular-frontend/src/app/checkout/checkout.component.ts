import { Component, Input, OnInit } from '@angular/core';
import { Order } from '../OrderProcess';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  selectedDishes: Order[] = [];

  ngOnInit(): void {
    
  }

  onSelectedDishesChanged(selectedDishes: Order[]): void {
    console.log('Ausgewählte Gerichte wurden aktualisiert:', selectedDishes);
    // Hier können weitere Aktionen mit den aktualisierten Gerichten durchgeführt werden
    this.selectedDishes = selectedDishes;
  }
}
