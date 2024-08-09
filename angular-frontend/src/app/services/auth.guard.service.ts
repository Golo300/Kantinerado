import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private USER: string = "USER";
  private KANTEEN: string = "KANTEEN";
  private ADMIN: string = "ADMIN";

  constructor(private authService: AuthService, private router: Router) {}

  private handleError(message: string): boolean {
    console.error(message);
    this.router.navigate(['/login']);
    return false;
  }

  hasUserAcces(): boolean {
    if (!this.authService.isLoggedIn()) {
      return this.handleError('User is not logged in.');
    }

    const roles = this.authService.getRoles();
    if (!roles || roles.length === 0) {
      return this.handleError('No roles found for user.');
    }

    return roles.includes(this.USER) || roles.includes(this.KANTEEN) || roles.includes(this.ADMIN);
  }

  hasKanteenAcces(): boolean {
    if (!this.authService.isLoggedIn()) {
      return this.handleError('User is not logged in.');
    }

    const roles = this.authService.getRoles();
    if (!roles || roles.length === 0) {
      return this.handleError('No roles found for user.');
    }

    return roles.includes(this.KANTEEN) || roles.includes(this.ADMIN);
  }

  hasAdminAcces(): boolean {
    if (!this.authService.isLoggedIn()) {
      return this.handleError('User is not logged in.');
    }

    const roles = this.authService.getRoles();
    if (!roles || roles.length === 0) {
      return this.handleError('No roles found for user.');
    }

    return roles.includes(this.ADMIN);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoles = next.data['allowedRoles'] as string[];
    if (allowedRoles && allowedRoles.length > 0) {
      const userRoles = this.authService.getRoles();
      if (userRoles.some(role => allowedRoles.includes(role))) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    }

    return true;
  }
}
