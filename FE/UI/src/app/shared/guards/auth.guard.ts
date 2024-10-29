import { inject } from "@angular/core";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../../app.service";

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const requestedUrl = state.url;
  console.log("AuthGuard: Проверка на маршрута:", requestedUrl);
  console.log("AuthGuard: Аутентикиран ли е потребителят:", authService.isLoggedIn());

  // За публични маршрути, винаги разрешаваме достъп
  if (requestedUrl.startsWith("/auth") && !requestedUrl.startsWith("/auth/change-password")) {
    if (authService.isLoggedIn()) {
      console.log("AuthGuard: Логнат потребител опитва да достъпи auth страници");
      return router.createUrlTree(["/pawn-shop/main-page"]);
    }
    return true;
  }

  // За защитени маршрути
  if (!authService.isLoggedIn()) {
    console.log("AuthGuard: Неоторизиран опит за достъп");
    return router.createUrlTree(["/auth/login"]);
  }

  return true;
};
