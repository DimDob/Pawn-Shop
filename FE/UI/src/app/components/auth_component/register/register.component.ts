// UI\src\app\components\auth_component\register\register.component.ts
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PrismData } from "../login/login_interfaces.ts/prismData";
import { NgForm } from "@angular/forms";
import { signal } from "@angular/core";
import { AuthService } from "../../../app.service";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { RegisterData } from "./interfaces/RegisterData";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent {
  @Input() public prismDetails!: PrismData;

  private isSubmitting = signal(false);
  public registerError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  public createAccount(createAccountForm: NgForm): void {
    if (createAccountForm.invalid || this.isSubmitting()) {
      return;
    }

    try {
      this.isSubmitting.set(true);

      const registerData: RegisterData = {
        email: this.prismDetails.signupEmail || "",
        password: this.prismDetails.signupPassword || "",
        confirmPassword: this.prismDetails.signupPassword2 || "",
        firstName: this.prismDetails.firstName || "",
        lastName: this.prismDetails.lastName || ""
      };

      this.authService.handlerUserRegister(registerData, `${environment.host}/api/auth/register`).subscribe({
        next: () => {
          console.log("Registration successful");
          this.router.navigate(["/auth/login"]);
        },
        error: error => {
          console.error("Registration error:", error);
          this.registerError = error.error?.message || "Registration failed";
        }
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  public navigateToLogin(): void {
    this.router.navigate(["/auth/login"]);
  }
}
