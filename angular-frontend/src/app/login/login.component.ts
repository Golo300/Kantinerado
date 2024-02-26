import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
      .subscribe(response => {
        // Hier können Sie die Antwort des Authentifizierungsservices verarbeiten
        console.log('Login erfolgreich:', response);
        // Weiterleitung nach erfolgreichem Login
        this.router.navigate(['/']); // Hier 'dashboard' durch Ihre Zielseite ersetzen
      }, error => {
        // Hier können Sie mit einem Fehler bei der Authentifizierung umgehen
        console.error('Fehler beim Login:', error);
        this.loginError = 'Fehler beim Login. Überprüfen Sie Ihre Anmeldeinformationen und versuchen Sie es erneut.';
      });
  }
}
