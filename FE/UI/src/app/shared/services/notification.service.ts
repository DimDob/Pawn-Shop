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
    console.log("NotificationService: Initialization");
  }

  showSuccess(message: string) {
    console.log("NotificationService: Displaying success message", message);
    this.snackBar.open(message, "Close", {
      ...this.config,
      panelClass: ["success-snackbar"]
    });
  }

  showError(message: string) {
    console.log("NotificationService: Displaying error message", message);
    this.snackBar.open(message, "Close", {
      ...this.config,
      panelClass: ["error-snackbar"]
    });
  }

  showInfo(message: string) {
    console.log("NotificationService: Displaying information message", message);
    this.snackBar.open(message, "Close", {
      ...this.config,
      panelClass: ["info-snackbar"]
    });
  }
}
