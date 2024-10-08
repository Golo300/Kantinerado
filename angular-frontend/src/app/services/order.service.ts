import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {FullOrder, Order, SendOrder} from "../Interfaces";
import {API_URL} from "../shared/constants"
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = API_URL


  constructor(private http: HttpClient) {
  }

  createOrder(orders: Order[]): Observable<any> {

    let sendOrders: SendOrder[] = []

    for (let order of orders) {

      const sendOrder: SendOrder =
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

    let deleted: number[] = []

    for (let order of deleteOrders) {
      deleted.push(order.id);
    }

    return this.http.post<any>(`${this.apiUrl}/order/batchRemove`, deleted).pipe(
      map(response => {
        return response;
      }));
  }

  getEveryOrderByKw(kw: number): Observable<Order[]> {
    return this.http.get<FullOrder[]>(`${this.apiUrl}/order/admin/${kw}`);
  }

  generateAdminPdf(orders: Order[], kw: number) {
    const doc = new jsPDF();
    let yPos = 10;

    doc.text('Alle Bestellungen der KW: ' + kw, 10, yPos);
    yPos += 10;

    const headers = [['Date', 'Dish', 'Veggie', 'Price']];
    const data = this.prepareAdminDataForPdf(orders);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: yPos
    });

    doc.save('Bestellübersicht_kw' + kw + ".pdf");
  }

  private prepareAdminDataForPdf(orders: Order[]): any[] {
    let preparedData: any[] = [];
    let dishCounts: { [key: string]: { count: number; veggie: boolean; price: number } } = {};

    // Zähle die Anzahl der Bestellungen für jedes Gericht
    orders.forEach(order => {
      const dishName = order.dish.title;
      const key = order.date.toString().slice(0, 10) + dishName; // Eindeutiger Schlüssel mit Datum für jedes Gericht
      if (!dishCounts[key]) {
        dishCounts[key] = {count: 0, veggie: order.veggie, price: order.dish.price};
      }
      dishCounts[key].count++;
    });

    // Durchlaufe die gezählten Gerichte und füge sie nur einmal in die vorbereiteten Daten ein
    for (const key in dishCounts) {
      if (dishCounts.hasOwnProperty(key)) {
        const dishName = key.substring(10); // Entferne das Datum aus dem Schlüssel
        const dishCount = dishCounts[key].count;
        const veggie = dishCounts[key].veggie ? 'Yes' : 'No';
        const price = dishCounts[key].price;
        const date = key.substring(0, 10); // Extrahiere das Datum aus dem Schlüssel

        // Füge das Gericht nur einmal in die Liste ein
        preparedData.push([
          date, // Datum
          `${dishName} (${dishCount}x)`,
          veggie,
          price
        ]);
      }
    }

    // Sortiere die vorbereiteten Daten nach dem Datum (erstes Element in jedem Array)
    preparedData.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    return preparedData;
  }


  generateUserPdf(newOrders: Order[], deletedOrders: Order[]) {
    const doc = new jsPDF();
    let yPos = 10;
    doc.text('Ihre Bestellübersicht', 10, yPos);
    yPos += 10;

    const headers = [['Date', 'Dish', 'Veggie', 'Price']];
    const newData = this.prepareUserDataForPdf(newOrders, 'green');
    const deletedData = this.prepareUserDataForPdf(deletedOrders, 'red');

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

    doc.save('Ihre Bestellungen.pdf');
  }

  private calculateTotalPrice(orders: Order[]): number {
    let totalPrice = 0;
    orders.forEach(order => {
      totalPrice += order.dish.price;
    });
    return totalPrice;
  }

  private prepareUserDataForPdf(orders: Order[], color: string): any[] {
    return orders.map(order => [
      {content: order.date.toString().slice(0, 10)},
      {content: order.dish.title},
      {content: order.veggie ? 'Yes' : 'No'},
      {content: color === 'red' ? '-' + order.dish.price : order.dish.price.toString(), styles: {textColor: color}}
    ]);
  }
}
