import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable} from 'rxjs';
import {Order} from "../Mealplan";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/order';


  constructor(private http: HttpClient) {
  }

  createOrder(credentials: { order: Order[] }): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/order`, credentials).pipe(
      catchError(error => {
        if (error.status === 406) {
          console.error(error.error) //Error aus dem Backend
        }
        throw error; // Andere Fehler weiterwerfen
      })
    );
  }
}
