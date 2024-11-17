// UI/src/app/components/auth_component/register/register.component.ts
import { Component } from "@angular/core";
import { Component, OnInit, NgZone } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { GoogleCredentialResponse } from "../../../shared/types/google-types";
import { faUser, faLock, faEnvelope, faIdCard } from "@fortawesome/free-solid-svg-icons";
import { GoogleAuthResponse } from "../../../shared/types/google-types";

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

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private ngZone: NgZone) {
    this.registerForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(32), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ["", Validators.required]
    });
  }

  ngOnInit() {
    console.log("Initializing Google Register");
    // @ts-ignore
    google.accounts.id.initialize({
      client_id: "330278508587-to2kfidhb611106vcpehancribb7li0t.apps.googleusercontent.com",
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      cancel_on_tap_outside: true
    });

    // @ts-ignore
    google.accounts.id.renderButton(document.getElementById("google-button-register"), { theme: "outline", size: "large", width: "100%" });
  }

  async handleCredentialResponse(response: any) {
    console.log("Google response:", response);
    this.ngZone.run(() => {
      if (response.credential) {
        console.log("RegisterComponent: Got Google credential");
        this.handleGoogleRegister(response.credential);
      } else {
        console.error("RegisterComponent: No credential in response");
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log("Form submitted", this.registerForm.value);
      // Handle form submission
    }
  }

  navigateToLogin() {
    this.router.navigate(["/auth/login"]);
  }

  private handleGoogleRegister(token: string) {
    console.log("RegisterComponent: Handling Google register");
    this.authService.handleGoogleRegister(token).subscribe({
      next: (response: GoogleAuthResponse) => {
        console.log("Google register successful", response);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        this.router.navigate(["/pawn-shop/main-page"]);
      },
      error: error => {
        console.error("Google register failed", error);
        if (error.status === 409) {
          this.router.navigate(["/auth/login"]);
        }
      }
    });
  }
}
