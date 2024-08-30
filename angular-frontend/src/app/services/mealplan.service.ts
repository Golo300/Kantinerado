import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Day, DayDishDTO } from '../Interfaces';
import { API_URL } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class MealserviceService {

  private apiUrl = API_URL + '/mealplan';

  constructor(private http: HttpClient) { }

  getMealplan(startDate: Date, endDate: Date): Observable<Day[]> {
    let params = new HttpParams()
      .set('start_date', startDate.toISOString().slice(0, 10))
      .set('end_date', endDate.toISOString().slice(0, 10));

    return this.http.get<Day[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  addDish(dayDishDTO: DayDishDTO): Observable<void> {
    console.log(dayDishDTO);
    return this.http.post<void>(this.apiUrl, dayDishDTO).pipe(
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
