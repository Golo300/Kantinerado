import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {FullOrder, Order, sendOrder} from "../Interfaces";
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
      return {newSelectedDishes: [], deletedDishes: []};
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
    return this.http.get<Order[]>(`${this.apiUrl}/order/pdf`);
  }

  generateAdminPdf(orders: Order[]) {
    const doc = new jsPDF();
    let yPos = 10;

    doc.text('Order Overview of all Users', 10, yPos);
    yPos += 10;

    const headers = [['Date', 'Dish', 'Veggie', 'Price']];
    const data = this.prepareDataForPdf(orders,'black');

    autoTable(doc, {
      head: headers,
      body: data,
      startY: yPos
    });

    doc.save('order_overview.pdf');
  }

  generateUserPdf(newOrders: Order[], deletedOrders: Order[]) {
    const doc = new jsPDF();
    let yPos = 10;

    doc.text('Your Order Overview', 10, yPos);
    yPos += 10;

    const headers = [['Date', 'Dish', 'Veggie', 'Price']];
    const newData = this.prepareDataForPdf(newOrders, 'green');
    const deletedData = this.prepareDataForPdf(deletedOrders, 'red');

    const data = [...newData, ...deletedData];

    const totalPrice = (this.calculateTotalPrice(newOrders) - this.calculateTotalPrice(deletedOrders)).toFixed(2); // Gesamtpreis berechnen und auf zwei Nachkommastellen runden

    const totalPriceFormatted = parseFloat(totalPrice) >= 0 ? totalPrice.toString() : '-' + Math.abs(parseFloat(totalPrice)).toString(); // Preis formatieren


    autoTable(doc, {
      head: headers,
      body: data,
      startY: yPos
    });

    // Hinzufügen der Gesamtsumme
    yPos += (data.length + 1) * 10; // Anpassung der Y-Position
    doc.text(`Total Price: ${totalPriceFormatted}`, 10, yPos);

    doc.save('order_overview.pdf');
  }

  private calculateTotalPrice(orders: Order[]): number {
    let totalPrice = 0;
    orders.forEach(order => {
      totalPrice += order.dish.price;
    });
    return totalPrice;
  }



  private prepareDataForPdf(orders: Order[], color: string): any[] {
    return orders.map(order => [
      {content: order.date.toString().slice(0, 10)},
      {content: order.dish.title},
      {content: order.veggie ? 'Yes' : 'No'},
      { content: color === 'red' ? '-' + order.dish.price : order.dish.price.toString(), styles: { textColor: color } }
    ]);
  }
}
