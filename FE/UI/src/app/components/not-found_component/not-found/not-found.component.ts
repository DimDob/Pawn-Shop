import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";

@Component({
  selector: "app-not-found",
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <p>Page not found</p>
      <button mat-raised-button color="primary" (click)="navigateHome()">Home</button>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        text-align: center;
        padding: 50px;
      }
      h1 {
        font-size: 72px;
        margin-bottom: 20px;
      }
    `
  ]
})
export class NotFoundComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigateHome() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/pawn-shop/main-page"]);
    } else {
      this.router.navigate(["/auth/login"]);
    }
  }
}
