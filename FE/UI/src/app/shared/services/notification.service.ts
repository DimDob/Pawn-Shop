// UI\src\app\services\notification.service.ts
import { Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  private config: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: "right",
    verticalPosition: "top"
  };

  constructor(private snackBar: MatSnackBar) {
    alert("Notification service initialized successfully");
  }

  public showSuccess(message: string): void {
    this.snackBar.open(message, "Close", {
      ...this.config,
      panelClass: ["success-snackbar"]
    });
  }

  public showError(message: string): void {
    this.snackBar.open(message, "Close", {
      ...this.config,
      panelClass: ["error-snackbar"]
    });
  }

  public showInfo(message: string): void {
    this.snackBar.open(message, "Close", {
      ...this.config,
      panelClass: ["info-snackbar"]
    });
  }
}
