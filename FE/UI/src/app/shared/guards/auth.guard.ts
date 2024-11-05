import { inject } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../../app.service";

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const requestedUrl = state.url;
  // For public routes, always allow access
  if (requestedUrl.startsWith("/auth") && !requestedUrl.startsWith("/auth/change-password")) {
    if (authService.isLoggedIn()) {
      return router.createUrlTree(["/pawn-shop/main-page"]);
    }
    return true;
  }

  // For protected routes
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(["/auth/login"]);
  }

  return true;
};
