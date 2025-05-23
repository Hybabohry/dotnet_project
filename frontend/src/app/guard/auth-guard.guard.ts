import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/services/login.service';
import { map } from 'rxjs/operators';
import { TokenService } from '../services/services/token.service';


export const authenticationGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);

  const loginService = inject(LoginService);
  const router = inject(Router);
  const isLoggedIn = loginService.isLoggedIn();
  return isLoggedIn ? true : router.createUrlTree(['/login']);
};
