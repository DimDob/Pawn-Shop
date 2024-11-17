// UI/src/app/components/server-error_component/server-error/server-error.component.ts

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";

@Component({
  selector: "app-server-error",
  template: `
    <div class="server-error-container">
      <h1>500</h1>
      <h2>{{ errorMessage }}</h2>
      <p>{{ detailedMessage }}</p>
      <div class="actions">
        <button mat-raised-button color="primary" (click)="retry()">Try Again</button>
        <button mat-raised-button (click)="navigateHome()">Return Home</button>
      </div>
    </div>
  `,
  styles: [
    `
      .server-error-container {
        text-align: center;
        padding: 50px;
        max-width: 600px;
        margin: 0 auto;
      }
      h1 {
        font-size: 72px;
        color: #f44336;
        margin-bottom: 20px;
      }
      .actions {
        margin-top: 30px;
        display: flex;
        gap: 20px;
        justify-content: center;
      }
    `
  ]
})
export class ServerErrorComponent implements OnInit {
  errorMessage = "Server Error";
  detailedMessage = "We are experiencing technical difficulties. Please try again later.";

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.checkBackendConnection();
  }

  private checkBackendConnection() {
    fetch("your-backend-health-check-endpoint")
      .then(response => {
        if (!response.ok) {
          this.errorMessage = "No Server Connection";
          this.detailedMessage = "Please check your internet connection and try again.";
        }
      })
      .catch(() => {
        this.errorMessage = "No Server Connection";
        this.detailedMessage = "Please check your internet connection and try again.";
      });
  }

  retry() {
    window.location.reload();
  }

  navigateHome() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/pawn-shop/main-page"]);
    } else {
      this.router.navigate(["/auth/login"]);
    }
  }
}
