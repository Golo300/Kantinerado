import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Mealplan } from './Mealplan';

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

  // Weitere Methoden hinzufügen, um mit deinem Backend zu interagieren
}

