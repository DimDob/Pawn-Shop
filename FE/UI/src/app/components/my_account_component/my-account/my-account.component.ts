// UI\src\app\components\my_account_component\my-account\my-account.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../../app.service";
import { Router } from "@angular/router";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"]
})
export class MyAccountComponent implements OnInit {
  public myAccountForm: FormGroup;
  public faUser = faUser;
  public errorMessage: string = "";
  private currentUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    console.log("MyAccountComponent: Initializing");
    this.currentUser = this.authService.getCurrentUser();

    this.myAccountForm = this.fb.group({
      username: ["", []],
      email: ["", [Validators.email]],
      shopAddress: ["", []],
      currentPassword: ["", [Validators.required, Validators.minLength(6)]]
    });

    if (this.currentUser) {
      console.log("MyAccountComponent: Setting initial form values");
      this.myAccountForm.patchValue({
        email: this.currentUser.loginUsername,
        // Можем да добавим и други полета, ако са налични в токена
      });
    }
  }

  onSubmit() {
    console.log("MyAccountComponent: Form submitted");

    if (this.myAccountForm.invalid) {
      console.log("MyAccountComponent: Form is invalid");
      this.notificationService.showError("Please fill in all required fields correctly");
      return;
    }

    const formValues = this.myAccountForm.value;
    const updateData: any = {
      currentPassword: formValues.currentPassword
    };

    if (formValues.username) updateData.newUsername = formValues.username;
    if (formValues.email && formValues.email !== this.currentUser?.loginUsername) {
      updateData.newEmail = formValues.email;
    }
    if (formValues.shopAddress) updateData.newShopAddress = formValues.shopAddress;

    if (Object.keys(updateData).length === 1) {
      console.log("MyAccountComponent: No changes to update");
      this.notificationService.showInfo("No changes to update");
      return;
    }

    console.log("MyAccountComponent: Sending update request", updateData);
    this.authService.updateUserAccount(updateData).subscribe({
      next: (response) => {
        console.log("MyAccountComponent: Update successful", response);
        this.notificationService.showSuccess("Account updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
      error: (error) => {
        console.error("MyAccountComponent: Update failed", error);
        if (error.status === 200) {
          console.log("MyAccountComponent: Update successful (with parsing error)");
          this.notificationService.showSuccess("Account updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          this.errorMessage = error.error?.message || "Failed to update account";
          this.notificationService.showError(this.errorMessage);
        }
      }
    });
  }

  onChangePassword() {
    if (this.currentUser?.id) {
      this.router.navigate([`/auth/change-password/${this.currentUser.id}`]);
    } else {
      this.notificationService.showError("Unable to change password. User ID not found.");
    }
  }
}
