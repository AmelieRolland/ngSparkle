import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getUserInfo();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const expectedRole = route.data['roles'];
    if (expectedRole && !user.roles.includes(expectedRole)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
