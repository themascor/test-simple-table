import { inject } from '@angular/core';
import { Router, UrlTree, type CanActivateFn } from '@angular/router';

export const authForRootGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isBadToken = localStorage.getItem('token') === 'false';
  return isBadToken ? router.createUrlTree(['403']) : true;
};
