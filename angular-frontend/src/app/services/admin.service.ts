import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationUser } from '../Interfaces';

interface PromoteDTO {
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/admin'; // Passen Sie dies an Ihre Backend-URL an

  constructor(private http: HttpClient) { }

  getAdminAccess(): Observable<string> {
    return this.http.get(this.baseUrl + '/', { responseType: 'text' });
  }

  getAllUsers(): Observable<ApplicationUser[]> {
    return this.http.get<ApplicationUser[]>(this.baseUrl + '/users');
  }

  promoteUser(username: string): Observable<string> {
    const promoteDTO: PromoteDTO = { username };
    return this.http.post(this.baseUrl + '/promote', promoteDTO, { responseType: 'text' });
  }

  deleteAccount(employeeId: number): Observable<string> {
    return this.http.delete(this.baseUrl + '/' + employeeId, { responseType: 'text' });
  }

  demoteUser(username: string): Observable<string> {
    const demoteDTO: PromoteDTO = { username };
    return this.http.post(this.baseUrl + '/demote', demoteDTO, { responseType: 'text' });
  }
}
