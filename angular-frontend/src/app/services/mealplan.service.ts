import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Dish, Mealplan } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class MealserviceService {

  private apiUrl = 'http://localhost:8080'; // Deine Backend-URL hier anpassen

  constructor(private http: HttpClient) { }

  getMealplan(kw: number): Observable<Mealplan> {
    return this.http.get<Mealplan>(`${this.apiUrl}/mealplan/${kw}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.error('Mealplan not found');
          return of({} as Mealplan); // Leeres Mealplan-Objekt zurückgeben
        }
        throw error; // Andere Fehler weiterwerfen
      })
    );
  }

  postNewDish(dish: Dish): Observable<Dish> {
    return this.http.post<Dish>(`${this.apiUrl}/mealplan/addMeal`, dish);
  }

  addMealToDay(dishId: number, kw: number, day: number): Observable<any> {
    const url = `${this.apiUrl}/mealplan/addMealDay/${dishId}/${kw}/${day}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(url, headers);
  }
}

