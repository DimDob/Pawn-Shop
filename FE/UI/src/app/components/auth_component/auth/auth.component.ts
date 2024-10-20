// UI\src\app\components\auth_component\auth\auth.component.ts
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { LoginComponent } from "../login/login.component";
import { User } from "../login/login_interfaces.ts/User";
import { PrismData } from "../login/login_interfaces.ts/prismData";
import { AuthService } from "../../../app.service";
import { Router } from "@angular/router";

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

  private host = "http://localhost:8080/"; // Change when we get a host

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
    const loginEndpoint = "/auth/login";
    this.prismDetails = userCredentials;

    this.authService.handleUserLoging(userCredentials, `${this.host}${loginEndpoint}`).subscribe({
      next: () => {
        // Routing will work when BE is started & running
        this.router.navigate(["/pawn-shop/main-page"]);
      },
      error: err => {
        console.error("Login failed", err);
      }
    });
  }
}
