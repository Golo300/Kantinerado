import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';


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

   extractAuthorities(authoritiesArray: any[]) {
    return authoritiesArray.map(item => item.authority);
  } 

  logout(): void {
    // JWT-Token aus dem Local Storage löschen
    localStorage.removeItem('token');
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
