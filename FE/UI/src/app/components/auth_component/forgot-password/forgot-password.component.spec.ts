// UI/src/app/components/auth_component/forgot-password/forgot-password.component.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ForgotPasswordComponent } from "./forgot-password.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../../app.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

describe("ForgotPasswordComponent", () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj("AuthService", ["forgotPassword"]);
    const notificationSpy = jasmine.createSpyObj("NotificationService", ["showSuccess", "showError"]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [ReactiveFormsModule, FontAwesomeModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it("must create the component", () => {
    expect(component).toBeTruthy();
  });

  it("the form must be invalid when the email field is empty", () => {
    component.forgotPasswordForm.controls["email"].setValue("");
    expect(component.forgotPasswordForm.invalid).toBeTrue();
  });

  it("the form must be valid with a correct email", () => {
    component.forgotPasswordForm.controls["email"].setValue("test@example.com");
    expect(component.forgotPasswordForm.valid).toBeTrue();
  });

  it("must call authService.forgotPassword when the form is valid and the email is sent successfully", fakeAsync(() => {
    const email = "test@example.com";
    component.forgotPasswordForm.controls["email"].setValue(email);
    authService.forgotPassword.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(authService.forgotPassword).toHaveBeenCalledWith(email);
    expect(notificationService.showSuccess).toHaveBeenCalledWith("Password reset instructions have been sent to your email");
    expect(router.navigate).toHaveBeenCalledWith(["/auth/login"]);
  }));

  it("must show an error when the reset email is not sent successfully", fakeAsync(() => {
    const email = "test@example.com";
    const errorResponse = { error: "Error sending email" };
    component.forgotPasswordForm.controls["email"].setValue(email);
    authService.forgotPassword.and.returnValue(throwError(() => errorResponse));

    component.onSubmit();
    tick();

    expect(authService.forgotPassword).toHaveBeenCalledWith(email);
    expect(notificationService.showError).toHaveBeenCalledWith("Error sending email");
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('must navigate to login when clicking "Back to Login"', () => {
    component.navigateToLogin();
    expect(router.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });
});
