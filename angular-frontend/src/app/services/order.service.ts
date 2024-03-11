import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {FullOrder, Order, sendOrder} from "../Interfaces";

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

  getOrderByKw(kw: number): Observable<FullOrder[]> {
    return this.http.get<FullOrder[]>(`${this.apiUrl}/order/${kw}`);
  }

  getAllOrders(): Observable<FullOrder[]> {
    return this.http.get<FullOrder[]>(`${this.apiUrl}/order/`);
  }

  getCart(): Order[] {
    const shopping_cart_newJson = localStorage.getItem('shopping_cart_new');
    if (shopping_cart_newJson == null) {return [];}
    
     return JSON.parse(shopping_cart_newJson);
  }
}