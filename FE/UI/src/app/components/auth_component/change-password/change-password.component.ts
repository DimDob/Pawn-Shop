// UI\src\app\components\auth_component\change-password\change-password.component.ts
import { Component, OnInit, OnDestroy, signal } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PrismData } from "../login/login_interfaces.ts/prismData";
import prismDetailsTemplate from "../login/templates/prismDetails.template";
import { ChangePasswordService } from "./change-password.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrl: "./change-password.component.scss"
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm: FormGroup;
  prismDetails = signal<PrismData>({ ...prismDetailsTemplate });
  userId = signal<string | null>(null);
  private changePasswordSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private changePasswordService: ChangePasswordService,
    private activeRoute: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
      reEnteredPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.userId.set(this.activeRoute.snapshot.paramMap.get("userId"));
  }

  ngOnDestroy(): void {
    this.changePasswordSubscription?.unsubscribe();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('reEnteredPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const passwordData = {
      ...this.prismDetails(),
      changedPassword: this.resetPasswordForm.get('password')?.value,
      changedPassword2: this.resetPasswordForm.get('reEnteredPassword')?.value
    };

    this.changePasswordSubscription = this.changePasswordService
      .changePassword(passwordData, this.userId());
  }
}
