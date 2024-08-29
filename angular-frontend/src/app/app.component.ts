import { Component } from '@angular/core';
import { AuthGuardService } from './services/auth.guard.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],  
})
export class AppComponent {
  title = 'homes';

  loggedIn: boolean = false;

  public userAccess: boolean = false;
  public kanteenAccess: boolean = false;
  public adminAccess: boolean = false;

  constructor(private authGuardService: AuthGuardService, private authService: AuthService, private router: Router) 
  {
    this.loggedIn = this.authService.isLoggedIn();
    this.userAccess = this.authGuardService.hasUserAcces();
    this.kanteenAccess = this.authGuardService.hasKanteenAcces();
    this.adminAccess = this.authGuardService.hasAdminAcces();
    console.log("is logged in: " + this.authService.isLoggedIn());
  }

  logout()
  {
    this.authService.logout();
    window.location.reload();
  }

  shouldShowNav(): boolean {
    return !(this.router.url === '/login' || this.router.url === '/register');
  }
}
