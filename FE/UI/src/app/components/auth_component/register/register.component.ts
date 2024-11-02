// UI\src\app\components\auth_component\register\register.component.ts
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PrismData } from "../login/login_interfaces.ts/prismData";
import { NgForm } from "@angular/forms";
import { signal } from "@angular/core";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent {
  @Input() public prismDetails!: PrismData;
  @Output() private userRegister = new EventEmitter<PrismData>();

  private isSubmitting = signal(false);

  public createAccount(createAccountForm: NgForm): void {
    if (createAccountForm.invalid || this.isSubmitting()) {
      alert("Please fix the form errors before submitting");
      return;
    }

    try {
      this.isSubmitting.set(true);
      this.userRegister.emit(this.prismDetails);
    } catch (error) {
      alert("An error occurred while creating your account: " + error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
