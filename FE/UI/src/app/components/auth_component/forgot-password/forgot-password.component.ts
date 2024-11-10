import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  faEnvelope = faEnvelope;
  faKey = faKey;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private notificationService: NotificationService) {
    this.forgotPasswordForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    console.log("ForgotPasswordComponent: Form submitted");
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.get("email")?.value;
      this.authService.forgotPassword(email).subscribe({
        next: () => {
          console.log("ForgotPasswordComponent: Reset email sent successfully");
          this.notificationService.showSuccess("Password reset instructions have been sent to your email");
          this.router.navigate(["/auth/login"]);
        },
        error: error => {
          console.error("ForgotPasswordComponent: Error sending reset email", error);
          this.notificationService.showError(error.error || "Failed to send reset email");
        }
      });
    }
  }

  navigateToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
