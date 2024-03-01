import { Component } from '@angular/core';
import { AuthGuardService } from './services/auth.guard.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',  
})
export class AppComponent {
  title = 'homes';

  loggedIn: boolean = false;

  public userAccess: boolean = false;
  public kanteenAccess: boolean = false;
  public adminAcess: boolean = false;

  constructor(private authGuardService: AuthGuardService, 
              private authService: AuthService,) 
  {
    this.loggedIn = this.authService.isLoggedIn();

    this.userAccess = this.authGuardService.hasUserAcces();
    this.kanteenAccess = this.authGuardService.hasKanteenAcces();
    this.adminAcess = this.authGuardService.hasUserAcces();
    console.log("is logged in: " + this.authService.isLoggedIn());
  }

  logout()
  {
    this.authService.logout();
    window.location.reload();
  }

  ngOnInit()
  {
    
  }
}
