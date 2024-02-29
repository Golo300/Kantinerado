import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, of, pipe, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  login(): void {
    console.log(this.username)
    this.authService.login({ username: this.username, password: this.password })
      .pipe(
        tap(() => console.log('Register erfolgreich')),
        catchError(error => {
          console.error('Fehler beim Login:', error);
        this.loginError = 'Fehler beim Login. Überprüfen Sie Ihre Anmeldeinformationen und versuchen Sie es erneut.';
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          console.log('Login erfolgreich:', response);
        // Weiterleitung nach erfolgreichem Login
        window.location.reload();
        this.router.navigate(['/order']); // Hier 'dashboard' durch Ihre Zielseite ersetzen
        }
      });
  }
}