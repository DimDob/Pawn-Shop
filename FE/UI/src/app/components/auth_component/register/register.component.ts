// UI/src/app/components/auth_component/register/register.component.ts
import { Component, OnInit, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { GoogleCredentialResponse } from "../../../shared/types/google-types";
import { faUser, faLock, faEnvelope, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { NotificationService } from "../../../shared/services/notification.service";
import { environment } from "../../../../environments/environment";
import { RegisterData } from "./interfaces/RegisterData";
import { catchError } from "rxjs/operators";
import { EMPTY } from "rxjs";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  faUser = faUser;
  faLock = faLock;
  faEnvelope = faEnvelope;
  faIdCard = faIdCard;
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private ngZone: NgZone, private notificationService: NotificationService) {
    this.registerForm = this.formBuilder.group(
      {
        email: ["", [Validators.required, Validators.email]],
        firstName: ["", Validators.required],
        lastName: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
        confirmPassword: ["", Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  ngOnInit() {
    // Initialize Google Sign-In
    document.addEventListener("DOMContentLoaded", () => {
      // @ts-ignore
      if (window.google && window.google.accounts) {
        this.initializeGoogleSignIn();
      } else {
        setTimeout(() => this.initializeGoogleSignIn(), 1000);
      }
    });
  }

  private initializeGoogleSignIn() {
    try {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: "330278508587-to2kfidhb611106vcpehancribb7li0t.apps.googleusercontent.com",
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // @ts-ignore
      google.accounts.id.renderButton(document.getElementById("google-button-register"), { theme: "outline", size: "large", width: "100%" });
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
    }
  }

  private handleCredentialResponse(response: any) {
    console.log("RegisterComponent: Got Google credential");
    this.handleGoogleRegister(response);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log("RegisterComponent: Submitting registration form");

      const registerData: RegisterData = {
        email: this.registerForm.get("email")?.value,
        password: this.registerForm.get("password")?.value,
        confirmPassword: this.registerForm.get("confirmPassword")?.value,
        firstName: this.registerForm.get("firstName")?.value,
        lastName: this.registerForm.get("lastName")?.value
      };

      this.authService.register(registerData).pipe(
        catchError(error => {
          if (error.status === 200) {
            // Success case with text response
            this.notificationService.showSuccess("Registration successful! Please check your email to confirm your account.");
            this.router.navigate(["/auth/login"]);
            return EMPTY;
          }
          throw error;
        })
      ).subscribe({
        next: () => {
          this.notificationService.showSuccess("Registration successful! Please check your email to confirm your account.");
          this.router.navigate(["/auth/login"]);
        },
        error: (error) => {
          console.error("Registration failed:", error);
          if (error.status === 409) {
            this.notificationService.showError("An account with this email already exists.");
          } else {
            this.notificationService.showError("Registration failed. Please try again.");
          }
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(["/auth/login"]);
  }

  private handleGoogleRegister(response: any) {
    console.log("RegisterComponent: Handling Google register");
    const token = response.credential;

    this.authService.handleGoogleRegister(token).subscribe({
      next: response => {
        console.log("Google register successful:", response);
        // След успешна регистрация, направете вход
        this.authService.handleGoogleLogin(token).subscribe({
          next: loginResponse => {
            console.log("Auto login after registration successful");
            this.authService.setTokens(loginResponse, true); // Remember Google users
            this.router.navigate(["/pawn-shop/main-page"]);
          },
          error: error => {
            console.error("Auto login after registration failed:", error);
            this.router.navigate(["/auth/login"]);
          }
        });
      },
      error: error => {
        console.error("Google register failed:", error);
        if (error.status === 200) {
          // Handle successful registration with error response
          this.authService.handleGoogleLogin(token).subscribe({
            next: loginResponse => {
              console.log("Auto login after registration successful");
              this.authService.setTokens(loginResponse, true);
              this.router.navigate(["/pawn-shop/main-page"]);
            },
            error: loginError => {
              console.error("Auto login after registration failed:", loginError);
              this.router.navigate(["/auth/login"]);
            }
          });
        } else {
          this.notificationService.showError("Registration failed. Please try again.");
        }
      }
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }
}
