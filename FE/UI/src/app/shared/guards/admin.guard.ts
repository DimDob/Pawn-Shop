// UI\src\app\shared\guards\admin.guard.ts
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../app.service";
import { User } from "../../components/auth_component/login/login_interfaces.ts/User";

export const adminGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.getCurrentUser();

  if (!user?.isAdmin) {
    console.log("AdminGuard: Access denied - not an admin");
    router.navigate(["/pawn-shop/main-page"]);
    return false;
  }

  return true;
};
