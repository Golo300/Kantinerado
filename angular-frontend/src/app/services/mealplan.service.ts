import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Dish, Mealplan } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class MealserviceService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getMealplan(kw: number): Observable<Mealplan> {
    return this.http.get<Mealplan>(`${this.apiUrl}/mealplan/${kw}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.warn(`Mealplan for KW ${kw} not found.`);
          return of({} as Mealplan);
        }
        console.error(`Error fetching mealplan for KW ${kw}:`, error);
        return throwError(() => new Error('Failed to load mealplan.'));
      })
    );
  }

  postNewDish(dish: Dish): Observable<Dish> {
    return this.http.post<Dish>(`${this.apiUrl}/mealplan/addMeal`, dish).pipe(
      catchError(error => {
        console.error('Error posting new dish:', error);
        return throwError(() => new Error('Failed to add new dish.'));
      })
    );
  }

  addMealToDay(dishId: number, kw: number, day: number): Observable<any> {
    const url = `${this.apiUrl}/mealplan/addMealDay/${dishId}/${kw}/${day}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, headers).pipe(
      catchError(error => {
        console.error(`Error adding meal to day: dishId=${dishId}, kw=${kw}, day=${day}`, error);
        return throwError(() => new Error('Failed to add meal to day.'));
      })
    );
  }
}
