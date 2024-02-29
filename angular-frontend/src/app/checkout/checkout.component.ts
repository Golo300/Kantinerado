import { Component, Input } from '@angular/core';
import { Order } from '../OrderProcess';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  @Input() selectedDishes: Order[] = [];

  // Hier kannst du die ausgewählten Gerichte in der Checkout-Komponente verwenden
  ngOnInit(): void {
    console.log(this.selectedDishes);
  }
}
