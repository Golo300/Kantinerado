import { Component, Input } from '@angular/core';
import { Order } from '../Interfaces';
import { OrderService } from '../services/order.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  
  public selectedDishes: Order[] = [];
  message: string = "";


  constructor(private orderService: OrderService){}

  ngOnInit(): void {
    this.selectedDishes = this.orderService.getCart();
  }

  createOrder() {
    this.orderService.createOrder(this.selectedDishes).pipe(
      tap((response: any) => {
        // Erfolgsfall
        this.message = "Bestellung erfolgreich";
        console.log(this.message); // Debugging-Information
      }),
      catchError(error => {
        console.error(error); // Fehler ausgeben
        return of(null); // Rückgabe eines Observable, um das Haupt-Observable fortzusetzen
      })
    ).subscribe()
  localStorage.removeItem('shopping_cart_new');
  // window.location.reload();
}

  getTotalPrice(): number {
    let totalPrice = 0;
    for (const order of this.selectedDishes) {
      totalPrice += order.dish.price;
    }
    return totalPrice;
  }
}
