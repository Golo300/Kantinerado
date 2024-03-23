import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dish } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { 
  }

  getDishesByCategory(category: String): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dish/${category}`);
  }
}
