// UI/src/app/components/auth_component/reset-password/reset-password.component.ts

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { faLock, faKey } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | null = null;
  faLock = faLock;
  faKey = faKey;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private notificationService: NotificationService) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ["", [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$")]],
      confirmPassword: ["", [Validators.required]]
    });
  }

  ngOnInit() {
    console.log("ResetPasswordComponent: Initializing");
    this.token = this.route.snapshot.queryParamMap.get("token");
    if (!this.token) {
      console.error("ResetPasswordComponent: No token found");
      this.notificationService.showError("Invalid reset link");
      this.router.navigate(["/auth/login"]);
    }
  }

  onSubmit() {
    console.log("ResetPasswordComponent: Form submitted");
    if (this.resetPasswordForm.valid && this.token) {
      const newPassword = this.resetPasswordForm.get("newPassword")?.value;

      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          console.log("ResetPasswordComponent: Password reset successfully");
          this.notificationService.showSuccess("Password has been reset successfully");
          this.router.navigate(["/auth/login"]);
        },
        error: error => {
          console.error("ResetPasswordComponent: Error resetting password", error);
          this.notificationService.showError(error.error || "Failed to reset password");
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
