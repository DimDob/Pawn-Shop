import { inject } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../../app.service";

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const requestedUrl = state.url;

  if (requestedUrl.includes("/auth/confirm-email") ||
      requestedUrl.includes("/auth/reset-password")) {
    return true;
  }

  if (requestedUrl.startsWith("/auth") && !requestedUrl.startsWith("/auth/change-password")) {
    if (authService.isLoggedIn()) {
      return router.createUrlTree(["/pawn-shop/main-page"]);
    }
    return true;
  }

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(["/auth/login"]);
  }

  return true;
};
