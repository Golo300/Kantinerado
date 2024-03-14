import { Component, Input } from '@angular/core';
import { FullOrder, Order } from '../Interfaces';
import { OrderService } from '../services/order.service';
import { catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  public newSelectedDishes: Order[] = [];
  public deletedDishes: FullOrder[] = [];
  message: string = "";

  constructor(private orderService: OrderService, private router: Router) { }

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
        this.router.navigate(["/order"]);
        
      }),
      catchError(error => {
        this.router.navigate(["/order"]);
        return of(null); // Rückgabe eines Observable, um das Haupt-Observable fortzusetzen
      })
    ).subscribe()

    // Hier werden entfernte Gerichte gelöscht
    this.orderService.deleteOrders(this.deletedDishes); // TODO

    localStorage.removeItem('shopping_cart');
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
