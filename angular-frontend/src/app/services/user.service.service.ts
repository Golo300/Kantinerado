import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationUser } from '../Interfaces';
import { API_URL } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  private apiUrl = API_URL + '/user';

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<ApplicationUser> {
    return this.http.get<ApplicationUser>(this.apiUrl + '/info');
  }
}