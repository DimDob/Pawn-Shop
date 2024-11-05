// UI\src\app\shared\guards\admin.guard.ts
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../app.service";
import { User } from "../../components/auth_component/login/login_interfaces.ts/User";

export const adminGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Get user data from localStorage
  const userStr = localStorage.getItem("user");

  // Check if there is a logged in user
  if (!userStr) {
    router.navigate(["/auth/login"]);
    return false;
  }

  // Parse user data
  const user: User = JSON.parse(userStr);

  // Check if the user is an admin
  if (!user.isAdmin) {
    // If not an admin, redirect to main page
    router.navigate(["/pawn-shop/main-page"]);
    return false;
  }

  // If an admin, allow access
  return true;
};
