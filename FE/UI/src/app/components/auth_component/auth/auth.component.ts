// UI\src\app\components\auth_component\auth\auth.component.ts
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoginComponent } from "../login/login.component";
import { User } from "../login/login_interfaces.ts/User";
import { PrismData } from "../login/login_interfaces.ts/prismData";
import { AuthService } from "../../../app.service";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment.development";
@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrl: "./auth.component.css"
})
export class AuthComponent {
  @ViewChild(LoginComponent) loginComponent: LoginComponent;

  @ViewChild("navButtons") navButtonsContainer: ElementRef;

  public currentRoute: string;

  public user: User;

  public prismDetails: PrismData;

  private host = environment.host;

  constructor(private authService: AuthService, private router: Router) {}

  showLogin() {
    this.loginComponent.showLogin();
  }

  showForgotPassword() {
    this.loginComponent.showForgotPassword();
  }

  showCreateEmployeeAccount() {
    this.loginComponent.showCreateEmployeeAccount();
  }

  showSignup() {
    this.loginComponent.showSignup();
  }

  handleUserCheck(user: User) {
    this.user = user;
  }

  handleUserLoging(userCredentials: PrismData) {
    const loginEndpoint = "auth/login";

    const credentials = {
      email: userCredentials.loginUsername,
      password: userCredentials.loginPassword
    };

    if (this.authService.isLoggedIn()) {
      return;
    }

    console.log("Опит за вход с:", credentials);

    this.authService.handleUserLoging(credentials, `${this.host}/${loginEndpoint}`).subscribe({
      next: response => {
        console.log("Успешна автентикация:", response);
        this.router.navigate(["/pawn-shop/main-page"]);
      },
      error: error => {
        console.error("Грешка при вход:", error.message);
        if (this.loginComponent) {
          this.loginComponent.loginError = "Грешен имейл или парола";
        }
      }
    });
  }
}
