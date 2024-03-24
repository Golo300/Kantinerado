import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { FullOrder, Order, sendOrder } from "../Interfaces";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8080';


  constructor(private http: HttpClient) {
  }

  createOrder(orders: Order[]): Observable<any> {

    var sendOrders: sendOrder[] = []

    for (var order of orders) {
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

  getCart(): { newSelectedDishes: Order[], deletedDishes: FullOrder[] } {
    const shoppingCartJson = localStorage.getItem('shopping_cart');
    if (shoppingCartJson == null) {
      return { newSelectedDishes: [], deletedDishes: [] };
    }
    return JSON.parse(shoppingCartJson);
  }

  deleteOrders(deleteOrders: FullOrder[]) {

    var deleted: number[] = []

    for (var order of deleteOrders) {
      deleted.push(order.id);
    }

    return this.http.post<any>(`${this.apiUrl}/order/batchRemove`, deleted).pipe(
      map(response => {
        return response;
      }));
  }
  getEveryOrder(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  generatePdf(orders: Order[]) {
    const doc = new jsPDF();
    let yPos = 10;

    doc.text('Order Overview', 10, yPos);
    yPos += 10;

    const headers = [['Date', 'Dish', 'Veggie']];
    const data = this.prepareDataForPdf(orders);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: yPos
    });

    doc.save('order_overview.pdf');
  }

  private prepareDataForPdf(orders: Order[]): any[] {
    return orders.map(order => [
      order.date.toString(),
      order.dish.title,
      order.veggie ? 'Yes' : 'No'
    ]);
  }
}
