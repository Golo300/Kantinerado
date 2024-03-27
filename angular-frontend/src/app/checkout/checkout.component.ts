import {Component} from '@angular/core';
import {FullOrder, Order} from '../Interfaces';
import {OrderService} from '../services/order.service';
import {catchError, forkJoin, of} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  public newSelectedDishes: Order[] = [];
  public deletedDishes: FullOrder[] = [];
  message: string = "";

  constructor(private orderService: OrderService, private router: Router) {
  }

  ngOnInit(): void {
    const shoppingCart = this.orderService.getCart();
    // Aufteilen der Gerichte in selectedDishes und deletedDishes
    this.newSelectedDishes = shoppingCart.newSelectedDishes;
    this.deletedDishes = shoppingCart.deletedDishes;
  }

  createOrder() {
    const createOrder$ = this.orderService.createOrder(this.newSelectedDishes).pipe(
      catchError(error => {
        return of(null);
      })
    );

    const deleteOrders$ = this.orderService.deleteOrders(this.deletedDishes).pipe(
      catchError(error => {
        return of(null);
      })
    );

    forkJoin([createOrder$, deleteOrders$]).subscribe(
      ([createOrderResponse, deleteOrdersResponse]) => {
        // Both requests are successful
        this.message = "Bestellung und Löschung erfolgreich";
        console.log(this.message);
        this.router.navigate(["/order"]);
      },
      error => {
        // At least one request failed
        console.error("An error occurred:", error);
        this.router.navigate(["/order"]);
      }
    );
    this.downloadNewOrderForUsers();
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

  // downloadEveryOrderForAdmins(kw: number) {
  //   this.orderService.getEveryOrderByKw(kw).subscribe((orders: Order[]) => {
  //     this.orderService.generateAdminPdf(orders);
  //   });
  // }

  downloadNewOrderForUsers() {
    this.orderService.generateUserPdf(this.newSelectedDishes, this.deletedDishes);
  }
}
