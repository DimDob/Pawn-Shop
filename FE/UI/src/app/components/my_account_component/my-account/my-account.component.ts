// UI\src\app\components\my_account_component\my-account\my-account.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../app.service";
import { Router } from "@angular/router";
import { faUser } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"]
})
export class MyAccountComponent implements OnInit {
  public myAccountForm: FormGroup;
  public faUser = faUser;
  public errorMessage: string = "";
  private userId: string = "123"; // Replace with the actual userId

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.myAccountForm = this.fb.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      shopAddress: ["", Validators.required],
      currentPassword: ["", Validators.required]
    });

    // Load user data if available
  }

  onSubmit() {
    if (this.myAccountForm.invalid) {
      return;
    }

    const { username, email, shopAddress, currentPassword } = this.myAccountForm.value;

    // Check current password
    this.authService.verifyPassword(currentPassword).subscribe({
      next: isValid => {
        if (isValid) {
          // Update user data
          alert("Account details updated successfully");
        } else {
          this.errorMessage = "Incorrect current password";
        }
      },
      error: err => {
        this.errorMessage = "Error verifying password";
      }
    });
  }

  onChangePassword() {
    this.router.navigate([`auth/change-password/${this.userId}`]);
  }
}
