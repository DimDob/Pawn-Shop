import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../app.service";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private notificationService: NotificationService) {
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
        },
        error: error => {
          console.error("ForgotPasswordComponent: Error sending reset email", error);
          this.notificationService.showError(error.error || "Failed to send reset email");
        }
      });
    }
  }
}
