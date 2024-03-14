import { Component, Input } from '@angular/core';
import { FullOrder, Order } from '../Interfaces';
import { OrderService } from '../services/order.service';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  public newSelectedDishes: Order[] = [];
  public deletedDishes: FullOrder[] = [];
  message: string = "";

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    const shoppingCart = this.orderService.getCart();
    // Aufteilen der Gerichte in selectedDishes und deletedDishes
    this.newSelectedDishes = shoppingCart.newSelectedDishes;
    this.deletedDishes = shoppingCart.deletedDishes;
  }

  createOrder() {
    // Hier werden neue Gerichte bestellt
    this.orderService.createOrder(this.newSelectedDishes).pipe(
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

    // Hier werden entfernte Gerichte gelöscht
    this.orderService.deleteOrders(this.deletedDishes); // TODO

    localStorage.removeItem('shopping_cart');
    window.location.reload();
  }

  getTotalPrice(): number {
    let totalPrice = 0;

    this.newSelectedDishes.forEach(element => {
      totalPrice += element.dish.price;
    });

    this.deletedDishes.forEach(element => {
      totalPrice -= element.dish.price;
    });

    return parseFloat(totalPrice.toFixed(2));
  }
}
