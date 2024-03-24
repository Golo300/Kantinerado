import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, of, pipe, tap } from 'rxjs';

/**
 * Calls login provider with data
 * 
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** username */
  username: string = '';
  /** password */
  password: string = '';
  /**error that is shown to user */
  loginError: string = '';

  /**
   * @ignore
   * 
   * @param router 
   * @param authService 
   */
  constructor(private router: Router, private authService: AuthService) { }

  /**
  *
  * sends request with data from the html to the @class{AuthServices}
  * 
  */
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
        while(!this.authService.isLoggedIn()){}
        window.location.href="/order"
        }
        
      });
  }
}
