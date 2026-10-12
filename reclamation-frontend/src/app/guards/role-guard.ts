import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const roleGuard = (route: any) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['role'];
  const userRole = auth.getUserRole();

  // Si le rôle correspond, autoriser l'accès
  if (userRole === expectedRole) {
    return true;
  }

  // Rediriger selon le rôle réel
  if (userRole === 'CLIENT') {
    return router.parseUrl('/client/dashboard');
  }
  if (userRole === 'AGENT') {
    return router.parseUrl('/agent/dashboard');
  }

  // Si pas connecté, rediriger vers login
  return router.parseUrl('/login');
};
