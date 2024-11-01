import { inject } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../../app.service";

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const requestedUrl = state.url;
  console.log("AuthGuard: Checking route:", requestedUrl);
  console.log("AuthGuard: Is user authenticated:", authService.isLoggedIn());

  // For public routes, always allow access
  if (requestedUrl.startsWith("/auth") && !requestedUrl.startsWith("/auth/change-password")) {
    if (authService.isLoggedIn()) {
      console.log("AuthGuard: Logged in user trying to access auth pages");
      return router.createUrlTree(["/pawn-shop/main-page"]);
    }
    return true;
  }

  // For protected routes
  if (!authService.isLoggedIn()) {
    console.log("AuthGuard: Unauthorized attempt to access protected route");
    return router.createUrlTree(["/auth/login"]);
  }

  return true;
};
