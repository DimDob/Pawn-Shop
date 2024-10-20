// UI\src\app\components\auth_component\register\register.component.ts
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PrismData } from "../login/login_interfaces.ts/prismData";
import prismDetailsTemplate from "../login/templates/prismDetails.template";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent {
  @Input() prismDetails: PrismData;
  @Output() userRegister: EventEmitter<PrismData> = new EventEmitter<PrismData>();

  createAccount(createAccountForm: NgForm) {
    if (createAccountForm.invalid) {
      return;
    }

    this.userRegister.emit(this.prismDetails);
  }
}
