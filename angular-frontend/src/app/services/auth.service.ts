import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = API_URL + '/auth';


  constructor(private http: HttpClient) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        // store token
        if(response.jwt == "") {throw Error("wrong credentials")};
        
        localStorage.setItem('token', response.jwt);

        
        const stringRoles = JSON.stringify(this.extractAuthorities(response.user.authorities));
        localStorage.setItem('roles', stringRoles);

        console.log(response.jwt);
        return response;
      })
    );
  }

  register(newUserInfo: {employeeId: number, username: string, email: string, password: string }): Observable<any> {
    
    return this.http.post<any>(`${this.apiUrl}/register`, newUserInfo).pipe(
      map((response) => {
        return response;
      }));
  }

  test(): Observable<String> {
    
    return this.http.get<any>(`${API_URL}/user/`).pipe(
      map((response) => {
        return response;
      }));
  }

   extractAuthorities(authoritiesArray: any[]) {
    return authoritiesArray.map(item => item.authority);
  } 

  logout(): void {
    localStorage.clear();
  }

  getRoles(): string[] {
      const storedStringListJson = localStorage.getItem('roles');
      if (storedStringListJson == null) {return [];}
      
       return JSON.parse(storedStringListJson);
  }

  isLoggedIn(): boolean {
    // Überprüfen, ob ein JWT-Token im Local Storage vorhanden ist
    return !!localStorage.getItem('token');
  }
}
