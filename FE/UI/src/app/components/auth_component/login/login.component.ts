// UI/src/app/components/auth_component/login/login.component.ts

import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  loginForm: FormGroup;
  faUser = faUser;
  faLock = faLock;
  loginError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private notificationService: NotificationService) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    console.log("LoginComponent: Form submitted");
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.get("email")?.value,
        password: this.loginForm.get("password")?.value,
        rememberMe: this.loginForm.get("rememberMe")?.value
      };

      this.authService.handleUserLoging(credentials, "").subscribe({
        next: () => {
          console.log("LoginComponent: Login successful");
          this.router.navigate(["/pawn-shop/main-page"]);
        },
        error: error => {
          console.error("LoginComponent: Login error", error);
          this.loginError = error.error?.message || "Wrong email or password";
          this.notificationService.showError(this.loginError || "An error occurred");
        }
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(["/auth/register"]);
  }

  navigateToForgotPassword() {
    this.router.navigate(["/auth/forgot-password"]);
  }
}
