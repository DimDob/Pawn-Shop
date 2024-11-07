// UI\src\app\components\auth_component\change-password\change-password.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ChangePasswordService } from "./change-password.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"]
})
export class ChangePasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private changePasswordService: ChangePasswordService, private router: Router, private notificationService: NotificationService) {
    this.resetPasswordForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required, Validators.minLength(6)]],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ["", [Validators.required]]
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    console.log("ChangePasswordComponent: Initializing");
  }

  passwordMatchValidator(g: FormGroup) {
    const newPass = g.get("newPassword")?.value;
    const confirmPass = g.get("confirmNewPassword")?.value;
    return newPass === confirmPass ? null : { mismatch: true };
  }

  onSubmit(): void {
    console.log("ChangePasswordComponent: Form submitted");

    if (this.resetPasswordForm.invalid) {
      console.log("ChangePasswordComponent: Form is invalid");
      this.notificationService.showError("Please fill all fields correctly");
      return;
    }

    const passwordData = {
      currentPassword: this.resetPasswordForm.get("currentPassword")?.value,
      newPassword: this.resetPasswordForm.get("newPassword")?.value,
      confirmNewPassword: this.resetPasswordForm.get("confirmNewPassword")?.value
    };

    console.log("ChangePasswordComponent: Sending password change request");
    this.changePasswordService.changePassword(passwordData).subscribe({
      next: () => {
        console.log("ChangePasswordComponent: Password changed successfully");
        this.notificationService.showSuccess("Password changed successfully. Please login with your new password");
        setTimeout(() => {
          localStorage.removeItem("auth_token");
          this.router.navigate(["/auth/login"]);
        }, 2000);
      },
      error: error => {
        console.error("ChangePasswordComponent: Error changing password", error);
        if (error.status === 200) {
          this.notificationService.showSuccess("Password changed successfully. Please login with your new password");
          setTimeout(() => {
            localStorage.removeItem("auth_token");
            this.router.navigate(["/auth/login"]);
          }, 2000);
        } else {
          this.notificationService.showError(error.error || "Failed to change password");
        }
      }
    });
  }
}
