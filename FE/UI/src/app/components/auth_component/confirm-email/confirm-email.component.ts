import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../app.service";
@Component({
  selector: "app-confirm-email",
  templateUrl: "./confirm-email.component.html",
  styleUrls: ["./confirm-email.component.scss"]
})
export class ConfirmEmailComponent implements OnInit {
  public confirmationStatus: "confirming" | "success" | "error" = "confirming";
  public errorMessage: string = "";

  constructor(private route: ActivatedRoute, private authService: AuthService, public router: Router) {}

  ngOnInit() {
    console.log("ConfirmEmailComponent: Initializing");
    const token = this.route.snapshot.queryParamMap.get("token");

    if (!token) {
      console.error("ConfirmEmailComponent: No token provided");
      this.confirmationStatus = "error";
      this.errorMessage = "Invalid confirmation link";
      return;
    }

    this.authService.confirmEmail(token).subscribe({
      next: (response) => {
        console.log("ConfirmEmailComponent: Email confirmed successfully", response);
        this.confirmationStatus = "success";
      },
      error: (error) => {
        if (error.status === 200) {
          this.confirmationStatus = "success";
        } else {
          console.error("ConfirmEmailComponent: Error confirming email", error);
          this.confirmationStatus = "error";
          this.errorMessage = error.error?.message || "Failed to confirm email";
        }
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
