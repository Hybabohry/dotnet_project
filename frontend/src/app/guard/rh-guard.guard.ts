import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/services/login.service';
import { map } from 'rxjs/operators';

export const rhGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  return loginService.isRhAdmin().pipe(
    map(isRh => {
      return isRh ? true : router.createUrlTree(['/home']);
    })
  );
};
