import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {Order, sendOrder} from "../Mealplan";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8080';


  constructor(private http: HttpClient) {
  }

  createOrder(orders: Order[]): Observable<any> {

    var sendOrders: sendOrder[] = []

    for(var order of orders)
    {
    const sendOrder: sendOrder = 
    {
        date: order.date,
        dish_id: order.dish.id,
        veggie: order.veggie
    }
    sendOrders.push(sendOrder);
    }

    return this.http.post<any>(`${this.apiUrl}/order/batch`, sendOrders).pipe(
      map(response => {
        return response;
      }));
  }

  getCart(): Order[] {
    const shopping_cartJson = localStorage.getItem('shopping_cart');
    if (shopping_cartJson == null) {return [];}
    
     return JSON.parse(shopping_cartJson);
  }
}