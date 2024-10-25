// UI\src\app\shared\guards\auth.guard.ts
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../app.service";

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Check if there is a logged in user
  const isAuthenticated = localStorage.getItem("user") !== null;

  // If there is no logged in user, redirect to login page
  if (!isAuthenticated) {
    router.navigate(["/auth/login"]);
    return false;
  }

  // If there is a logged in user, allow access
  return true;
};
