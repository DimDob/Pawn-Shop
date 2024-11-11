// UI\src\app\components\auth_component\login\login.component.ts
import { Component, OnInit, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { GoogleCredentialResponse } from "../../../shared/types/google-types";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  faUser = faUser;
  faLock = faLock;
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private ngZone: NgZone) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    console.log("Initializing Google Sign-In");
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: "330278508587-to2kfidhb611106vcpehancribb7li0t.apps.googleusercontent.com",
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById("google-button"), { theme: "outline", size: "large", width: "100%" });
  }

  async handleCredentialResponse(response: any) {
    console.log("Google response:", response);
    this.ngZone.run(() => {
      if (response.credential) {
        console.log("LoginComponent: Got Google credential");
        this.handleGoogleLogin(response.credential);
      } else {
        console.error("LoginComponent: No credential in response");
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log("Form submitted", this.loginForm.value);
      // Handle form submission
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
      next: response => {
        console.log("Google login successful", response);
        // Store the token from response
        localStorage.setItem("token", response.token);
        this.router.navigate(["/home"]);
      },
      error: error => {
        console.error("Google login failed", error);
        if (error.status === 403) {
          console.error("Access forbidden. Check backend permissions.");
        }
      }
    });
  }
}
