import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '@app/features/auth/services/local-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const lsService = inject(LocalStorageService);

  if (lsService.user()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
