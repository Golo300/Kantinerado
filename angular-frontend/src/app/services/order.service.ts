import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {Order} from "../Mealplan";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8080';


  constructor(private http: HttpClient) {
  }

  createOrder(order: Order): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/order/`, order).pipe(
      map(response => {
        return response;
      }));
  }
}