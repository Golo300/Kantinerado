import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Dish } from '../Interfaces';
import { API_URL } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private apiUrl = API_URL;

  constructor(private http: HttpClient) {
  }

  getDishesByCategory(category: String): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dish/${category}`);
  }

  createDish(dish: Dish): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/dish`, dish).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
