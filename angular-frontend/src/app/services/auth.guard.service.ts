import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service"
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private USER: string = "USER";
  private KANTEEN: string = "KANTEEN";
  private ADMIN: string = "ADMIN";

  hasUserAcces(): boolean
  {

    if(!this.authService.isLoggedIn()) {return false;}

      const roles = this.authService.getRoles();

      return (roles.includes(this.USER) || roles.includes(this.KANTEEN) || roles.includes(this.ADMIN));
  }

  hasKanteenAcces(): boolean
  {
    if(!this.authService.isLoggedIn()) {return false;}

      const roles = this.authService.getRoles();
      return (roles.includes(this.KANTEEN) || roles.includes(this.ADMIN));
  }

  hasAdminAcces(): boolean
  {
    if(!this.authService.isLoggedIn()) {return false;}

      const roles = this.authService.getRoles();
      return (roles.includes(this.ADMIN));
  }
  
  constructor( private authService: AuthService, private router: Router)
   { 



   }
   canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
    // Überprüfen, ob der Benutzer authentifiziert ist
    
    if (!this.authService.isLoggedIn()) {
      // Benutzer ist nicht authentifiziert, Weiterleitung zur Anmeldeseite
      this.router.navigate(['/login']);
      return false;
    }

    // Überprüfen der Benutzerrollen
    const allowedRoles = next.data['allowedRoles'] as string[];
    if (allowedRoles && allowedRoles.length > 0) {
      const userRoles = this.authService.getRoles(); // Nehmen Sie an, dass diese Methode die Rollen des Benutzers zurückgibt
      for (const role of userRoles) {
        if (allowedRoles.includes(role)) {
          // Benutzer hat eine erlaubte Rolle, Zugriff erlauben
          return true;
        }
      }
      // Benutzer hat keine erlaubte Rolle, Zugriff verweigern
      this.router.navigate(['/login']); // Weiterleitung zu einer Seite mit einer "Unbefugt"-Nachricht
      return false;
    }

    // Standardmäßig den Zugriff erlauben, wenn keine Rollen überprüft werden müssen
    return true;
  }
}
