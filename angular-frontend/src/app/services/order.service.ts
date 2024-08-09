import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, of } from 'rxjs';
import { FullOrder, Order, SendOrder } from "../Interfaces";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8080';
  private existingOrderNumbers = new Set<number>();

  constructor(private http: HttpClient) {}

  createOrder(orders: Order[]): Observable<any> {
    const sendOrders: SendOrder[] = orders.map(order => ({
      date: order.date,
      dish_id: order.dish.id,
      veggie: order.veggie
    }));

    return this.http.post<any>(`${this.apiUrl}/order/batch`, sendOrders).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error creating orders:', error);
        return throwError(() => new Error('Failed to create orders.'));
      })
    );
  }

  getOrderByKw(kw: number): Observable<FullOrder[]> {
    return this.http.get<FullOrder[]>(`${this.apiUrl}/order/${kw}`).pipe(
      catchError(error => {
        console.error(`Error fetching orders for KW ${kw}:`, error);
        return throwError(() => new Error('Failed to load orders.'));
      })
    );
  }

  getAllOrders(): Observable<FullOrder[]> {
    return this.http.get<FullOrder[]>(`${this.apiUrl}/order/`).pipe(
      catchError(error => {
        console.error('Error fetching all orders:', error);
        return throwError(() => new Error('Failed to load all orders.'));
      })
    );
  }

  getCart(): { newSelectedDishes: Order[], deletedDishes: FullOrder[] } {
    const shoppingCartJson = localStorage.getItem('shopping_cart');
    if (!shoppingCartJson) {
      console.warn('No items found in shopping cart.');
      return { newSelectedDishes: [], deletedDishes: [] };
    }

    return JSON.parse(shoppingCartJson);
  }

  saveCart(cart: { newSelectedDishes: Order[], deletedDishes: FullOrder[] }): void {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
  }

  clearCart(): void {
    localStorage.removeItem('shopping_cart');
  }

  deleteOrders(deleteOrders: FullOrder[]): Observable<any> {
    const deletedIds: number[] = deleteOrders.map(order => order.id);

    return this.http.post<any>(`${this.apiUrl}/order/batchRemove`, deletedIds).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error deleting orders:', error);
        return throwError(() => new Error('Failed to delete orders.'));
      })
    );
  }

  getEveryOrderByKw(kw: number): Observable<Order[]> {
    return this.http.get<FullOrder[]>(`${this.apiUrl}/order/admin/${kw}`).pipe(
      catchError(error => {
        console.error(`Error fetching admin orders for KW ${kw}:`, error);
        return throwError(() => new Error('Failed to load admin orders.'));
      })
    );
  }

  generateAdminPdf(orders: Order[], kw: number): void {
    const doc = new jsPDF();
    let yPos = 10;

    doc.text(`Alle Bestellungen der KW: ${kw}`, 10, yPos);
    yPos += 10;

    const headers = [['Date', 'Dish', 'Veggie', 'Price']];
    const data = this.prepareAdminDataForPdf(orders);

    autoTable(doc, {
      head: headers,
      body: data,
      startY: yPos
    });

    doc.save(`Bestellübersicht_kw${kw}.pdf`);
  }

  private prepareAdminDataForPdf(orders: Order[]): any[] {
    const preparedData: any[] = [];
    const dishCounts: { [key: string]: { count: number; veggie: boolean; price: number } } = {};

    orders.forEach(order => {
      const dishName = order.dish.title;
      const dateKey = new Date(order.date).toISOString().slice(0, 10);
      const key = `${dateKey}_${dishName}_${order.veggie}`;
      if (!dishCounts[key]) {
        dishCounts[key] = { count: 0, veggie: order.veggie, price: order.dish.price };
      }
      dishCounts[key].count++;
    });

    for (const key in dishCounts) {
      if (dishCounts.hasOwnProperty(key)) {
        const [date, dishName, veggie] = key.split('_');
        const dishCount = dishCounts[key].count;
        const price = dishCounts[key].price;

        preparedData.push([
          date,
          `${dishName} (${dishCount}x)`,
          veggie === 'true' ? 'Yes' : 'No',
          (price * dishCount).toFixed(2)
        ]);
      }
    }

    preparedData.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

    return preparedData;
  }

  generateUserPdf(newOrders: Order[], deletedOrders: Order[]): void {
    const doc = new jsPDF();
    let yPos = 10;
    const uniqueOrderNumber = this.generateUniqueOrderNumber();

    doc.text(`Ihre Bestellübersicht mit der Nummer: ${uniqueOrderNumber}`, 10, yPos);
    yPos += 10;

    const headers = [['Date', 'Dish', 'Veggie', 'Price']];
    const newData = this.prepareUserDataForPdf(newOrders, 'green');
    const deletedData = this.prepareUserDataForPdf(deletedOrders, 'red');

    const data = [...newData, ...deletedData];

    const totalPrice = (this.calculateTotalPrice(newOrders) - this.calculateTotalPrice(deletedOrders)).toFixed(2);
    const totalPriceFormatted = parseFloat(totalPrice) >= 0 ? totalPrice : `-${Math.abs(parseFloat(totalPrice)).toFixed(2)}`;

    autoTable(doc, {
      head: headers,
      body: data,
      startY: yPos
    });

    yPos += (data.length + 1) * 10;
    doc.text(`Total Price: ${totalPriceFormatted}`, 10, yPos);

    doc.save(`Ihre_Bestellung_${uniqueOrderNumber}.pdf`);
  }

  private calculateTotalPrice(orders: Order[]): number {
    return orders.reduce((total, order) => total + order.dish.price, 0);
  }

  private prepareUserDataForPdf(orders: Order[], color: string): any[] {
    return orders.map(order => [
      { content: new Date(order.date).toISOString().slice(0, 10) },
      { content: order.dish.title },
      { content: order.veggie ? 'Yes' : 'No' },
      { content: color === 'red' ? `-${order.dish.price.toFixed(2)}` : order.dish.price.toFixed(2), styles: { textColor: color } }
    ]);
  }

  private generateUniqueOrderNumber(): number {
    let orderNumber = Math.floor(Math.random() * 90000) + 10000;
    while (this.existingOrderNumbers.has(orderNumber)) {
      orderNumber = Math.floor(Math.random() * 90000) + 10000;
    }
    this.existingOrderNumbers.add(orderNumber);
    return orderNumber;
  }
}
