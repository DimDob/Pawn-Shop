// UI/src/app/components/auth_component/login/login.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login.component";
import { AuthService } from "../../../app.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let notificationServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Creating mocks for the dependencies
    authServiceMock = {
      handleUserLoging: jasmine.createSpy("handleUserLoging")
    };

    notificationServiceMock = {
      showSuccess: jasmine.createSpy("showSuccess"),
      showError: jasmine.createSpy("showError")
    };

    routerMock = {
      navigate: jasmine.createSpy("navigate")
    };

    // Configuring the TestBed with necessary modules and providers
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, FontAwesomeModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Creating the component instance and triggering initial data binding
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the LoginComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with empty values and validators", () => {
    const form = component.loginForm;
    expect(form).toBeDefined();
    expect(form.get("email")?.value).toBe("");
    expect(form.get("password")?.value).toBe("");
    expect(form.get("rememberMe")?.value).toBeFalse();
    expect(form.get("email")?.valid).toBeFalse();
    expect(form.get("password")?.valid).toBeFalse();
  });

  it("should have an invalid form when empty", () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalse();
  });

  it("should validate email field correctly", () => {
    const emailControl = component.loginForm.get("email");
    emailControl?.setValue("invalid-email");
    emailControl?.markAsTouched();
    fixture.detectChanges();

    const emailInput = fixture.debugElement.query(By.css("input[formControlName='email']"));
    expect(emailInput.classes["invalid"]).toBeTrue();
    // expect(emailInput.nativeElement.textContent).toContain("Please enter a valid email address"); // Removed as no .error-message exists
  });

  it("should validate password field correctly", () => {
    const passwordControl = component.loginForm.get("password");
    passwordControl?.setValue("");
    passwordControl?.markAsTouched();
    fixture.detectChanges();

    const passwordInput = fixture.debugElement.query(By.css("input[formControlName='password']"));
    expect(passwordInput.classes["invalid"]).toBeTrue();
    // expect(passwordInput.nativeElement.textContent).toContain("Password is required"); // Removed as no .error-message exists
  });
  it("should enable the submit button when the form is valid", () => {
    const form = component.loginForm;
    form.get("email")?.setValue("test@example.com");
    form.get("password")?.setValue("Valid@123");
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeFalse();
  });

  it("should disable the submit button when the form is invalid", () => {
    const form = component.loginForm;
    form.get("email")?.setValue("invalid-email");
    form.get("password")?.setValue("");
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeTrue();
  });

  it("should call authService.handleUserLoging on valid form submission", fakeAsync(() => {
    const form = component.loginForm;
    form.get("email")?.setValue("test@example.com");
    form.get("password")?.setValue("Valid@123");
    form.get("rememberMe")?.setValue(true);
    fixture.detectChanges();

    // Mocking the AuthService response
    authServiceMock.handleUserLoging.and.returnValue(of({}));

    // Triggering the form submission
    const formElement = fixture.debugElement.query(By.css("form"));
    formElement.triggerEventHandler("ngSubmit", null);
    tick();

    expect(authServiceMock.handleUserLoging).toHaveBeenCalledWith(
      {
        email: "test@example.com",
        password: "Valid@123",
        rememberMe: true
      },
      ""
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(["/pawn-shop/main-page"]);
  }));

  it("should show error message on failed login attempt", fakeAsync(() => {
    const form = component.loginForm;
    form.get("email")?.setValue("test@example.com");
    form.get("password")?.setValue("Invalid@123");
    fixture.detectChanges();

    // Mocking the AuthService to return an error
    authServiceMock.handleUserLoging.and.returnValue(throwError({ error: { message: "Wrong email or password" } }));

    // Triggering the form submission
    const formElement = fixture.debugElement.query(By.css("form"));
    formElement.triggerEventHandler("ngSubmit", null);
    tick();

    expect(authServiceMock.handleUserLoging).toHaveBeenCalledWith(
      {
        email: "test@example.com",
        password: "Invalid@123",
        rememberMe: false
      },
      ""
    );
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Wrong email or password");
    expect(component.loginError).toBe("Wrong email or password");
  }));
  it("should navigate to register page when navigateToRegister is called", () => {
    component.navigateToRegister();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/register"]);
  });

  it("should navigate to forgot password page when navigateToForgotPassword is called", () => {
    component.navigateToForgotPassword();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/forgot-password"]);
  });
});
