import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/services/login.service';
import { map } from 'rxjs/operators';

export const employerGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  return loginService.isEmployeur().pipe(
    map(isEmp => {
      return isEmp ? true : router.createUrlTree(['/home']);
    })
  );
};
