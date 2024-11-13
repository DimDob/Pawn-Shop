// UI/src/app/components/auth_component/reset-password/reset-password.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { ResetPasswordComponent } from "./reset-password.component";
import { AuthService } from "../../../app.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { Router, ActivatedRoute } from "@angular/router";
import { of, throwError } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";

describe("ResetPasswordComponent", () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceMock: any;
  let notificationServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    authServiceMock = {
      resetPassword: jasmine.createSpy("resetPassword")
    };

    notificationServiceMock = {
      showSuccess: jasmine.createSpy("showSuccess"),
      showError: jasmine.createSpy("showError")
    };

    routerMock = {
      navigate: jasmine.createSpy("navigate")
    };

    activatedRouteMock = {
      snapshot: {
        queryParamMap: {
          get: jasmine.createSpy("get").and.returnValue("mockToken")
        }
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [ReactiveFormsModule, FontAwesomeModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("must create the component", () => {
    expect(component).toBeTruthy();
  });

  it("must initialize the form with empty values and validators", () => {
    const form = component.resetPasswordForm;
    expect(form).toBeDefined();
    expect(form.get("newPassword")?.value).toBe("");
    expect(form.get("confirmPassword")?.value).toBe("");
    expect(form.get("newPassword")?.valid).toBeFalse();
    expect(form.get("confirmPassword")?.valid).toBeFalse();
  });

  it("must be invalid if the fields are empty", () => {
    const form = component.resetPasswordForm;
    expect(form.valid).toBeFalse();
  });

  it("must be valid if the fields are correctly filled", () => {
    const form = component.resetPasswordForm;
    form.get("newPassword")?.setValue("Valid@123");
    form.get("confirmPassword")?.setValue("Valid@123");
    expect(form.valid).toBeTrue();
  });

  it("must show an error if the new password does not match the pattern", () => {
    const form = component.resetPasswordForm;
    form.get("newPassword")?.setValue("invalid"); // does not match the pattern
    form.get("confirmPassword")?.setValue("invalid");
    fixture.detectChanges();

    const errorMsg = fixture.debugElement.query(By.css(".error-message"));
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.nativeElement.textContent).toContain("Password must contain at least 8 characters");
  });

  it("must call authService.resetPassword when the form is valid", () => {
    const form = component.resetPasswordForm;
    form.get("newPassword")?.setValue("Valid@123");
    form.get("confirmPassword")?.setValue("Valid@123");

    authServiceMock.resetPassword.and.returnValue(of({}));

    component.onSubmit();

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith("mockToken", "Valid@123");
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith("Password has been reset successfully");
    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });

  it("must show an error if resetPassword returns an error", () => {
    const form = component.resetPasswordForm;
    form.get("newPassword")?.setValue("Valid@123");
    form.get("confirmPassword")?.setValue("Valid@123");

    authServiceMock.resetPassword.and.returnValue(throwError({ error: "Reset failed" }));

    component.onSubmit();

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith("mockToken", "Valid@123");
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Reset failed");
  });

  it("must navigate to login if there is no token during initialization", () => {
    activatedRouteMock.snapshot.queryParamMap.get.and.returnValue(null);
    component.ngOnInit();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Invalid reset link");
    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });
});
