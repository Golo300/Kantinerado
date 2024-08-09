import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Dish } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getDishesByCategory(category: String): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dish/${category}`).pipe(
      catchError(error => {
        console.error(`Failed to fetch dishes for category ${category}:`, error);
        return throwError(() => new Error(`Could not load dishes for category ${category}.`));
      })
    );
  }
}
