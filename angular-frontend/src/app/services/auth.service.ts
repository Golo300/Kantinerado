import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        if (!response.jwt || response.jwt.trim() === "") {
          throw new Error("Invalid credentials: JWT token is missing.");
        }
        localStorage.setItem('token', response.jwt);
        const stringRoles = JSON.stringify(this.extractAuthorities(response.user.authorities));
        localStorage.setItem('roles', stringRoles);
        return response;
      }),
      catchError(error => {
        console.error("Login error:", error);
        return throwError(() => new Error('Login failed, please try again.'));
      })
    );
  }

  register(newUserInfo: { employeeId: number, username: string, email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, newUserInfo).pipe(
      map(response => response),
      catchError(error => {
        console.error("Registration error:", error);
        return throwError(() => new Error('Registration failed, please try again.'));
      })
    );
  }

  test(): Observable<String> {
    return this.http.get<any>(`http://localhost:8080/user/`).pipe(
      map(response => response),
      catchError(error => {
        console.error("Test error:", error);
        return throwError(() => new Error('Test request failed.'));
      })
    );
  }

  extractAuthorities(authoritiesArray: any[]): string[] {
    return authoritiesArray.map(item => item.authority);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
  }

  getRoles(): string[] {
    const storedStringListJson = localStorage.getItem('roles');
    return storedStringListJson ? JSON.parse(storedStringListJson) : [];
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
