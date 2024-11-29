// UI/src/app/components/auth_component/login/login.component.ts
import { Component, OnInit, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { GoogleCredentialResponse } from "../../../shared/types/google-types";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  faUser = faUser;
  faLock = faLock;
  loginForm: FormGroup;
  loginError: string;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private ngZone: NgZone, private notificationService: NotificationService) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    console.log("Initializing Google Sign-In");

    // Wait for the document to be fully loaded
    document.addEventListener("DOMContentLoaded", () => {
      // @ts-ignore
      if (window.google && window.google.accounts) {
        this.initializeGoogleSignIn();
      } else {
        // Retry after a short delay if google is not yet available
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
      google.accounts.id.renderButton(document.getElementById("google-button"), { theme: "outline", size: "large", width: "100%" });
    } catch (error) {
      console.error("Failed to initialize Google Sign-In:", error);
    }
  }

  async handleCredentialResponse(response: any) {
    console.log("Full Google response:", response);
    this.ngZone.run(() => {
      if (response.credential) {
        console.log("Token length:", response.credential.length);
        this.handleGoogleLogin(response.credential);
      } else {
        console.error("No credential in response:", response);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // sign-in-with-google-endpoint-BE-and-FE
      console.log("Form submitted", this.loginForm.value);
      // Handle form submission
      //
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

  private handleGoogleLogin(token: string) {
    console.log("LoginComponent: Handling Google login with token length:", token.length);
    this.authService.handleGoogleLogin(token).subscribe({
      next: (response: any) => {
        console.log("Google login successful", response);

        // Store the token using the auth service
        this.authService.setTokens(response, true); // Always remember Google users

        // Use the router service for navigation
        this.ngZone.run(() => {
          this.router.navigate(["/pawn-shop/main-page"]);
        });
      },
      error: error => {
        console.error("Google login failed", error);
        this.notificationService.showError("Google login failed. Please try again.");
      }
    });
  }
}
