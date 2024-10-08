import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = "";
  email: string = "";
  employeeId!: number;
  password: string = "";
  registrationError: string = "";

  constructor(private router: Router ,private authService: AuthService) { }

  register() {
    this.authService.register({ employeeId:  this.employeeId, username: this.username, email: this.email, password: this.password })
      .pipe(
        tap(() => {console.log('Register erfolgreich');
                  this.router.navigate(['/login']);}),
        catchError(error => {
          console.error('Fehler beim Regestrieren:', error);
          this.registrationError = 'Fehler beim Registrieren. Überprüfen Sie Ihre Anmeldeinformationen und versuchen Sie es erneut.';
          return of(null);
        })
      )
      .subscribe(response => {
        console.log(response)
      });
  }

  routeLogin() {
    this.router.navigate(['/login']);
  }

  isFormValid(): boolean {
    return !!this.username && !!this.email && !!this.employeeId && !!this.password;
  }   
}
