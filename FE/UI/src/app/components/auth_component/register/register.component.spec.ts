// UI/src/app/components/auth_component/register/register.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./register.component";
import { AuthService } from "../../../app.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";
import { environment } from "../../../../environments/environment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { trigger, transition } from "@angular/animations"; // Добавено

describe("RegisterComponent", () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceMock: any;
  let notificationServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      handlerUserRegister: jasmine.createSpy("handlerUserRegister"),
      register: jasmine.createSpy("register")
    };

    notificationServiceMock = {
      showSuccess: jasmine.createSpy("showSuccess"),
      showError: jasmine.createSpy("showError")
    };

    routerMock = {
      navigate: jasmine.createSpy("navigate")
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, FontAwesomeModule, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    })
      .overrideComponent(RegisterComponent, {
        // Добавено
        set: {
          animations: [trigger("if", [transition("* <=> *", [])])]
        }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("must create the component", () => {
    expect(component).toBeTruthy();
  });

  it("must initialize the form with empty values and validators", () => {
    const form = component.registerForm;
    expect(form).toBeDefined();
    expect(form.get("email")?.value).toBe("");
    expect(form.get("password")?.value).toBe("");
    expect(form.get("confirmPassword")?.value).toBe("");
    expect(form.get("firstName")?.value).toBe("");
    expect(form.get("lastName")?.value).toBe("");
    expect(form.get("email")?.valid).toBeFalse();
    expect(form.get("password")?.valid).toBeFalse();
    expect(form.get("confirmPassword")?.valid).toBeFalse();
    expect(form.get("firstName")?.valid).toBeFalse();
    expect(form.get("lastName")?.valid).toBeFalse();
  });

  it("must be invalid if the fields are empty", () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalse();
  });

  it("must be valid if the fields are correctly filled", () => {
    const form = component.registerForm;
    form.get("email")?.setValue("test@example.com");
    form.get("password")?.setValue("Valid@123");
    form.get("confirmPassword")?.setValue("Valid@123");
    form.get("firstName")?.setValue("John");
    form.get("lastName")?.setValue("Doe");
    expect(form.valid).toBeTrue();
  });

  it("must show an error if the email is invalid", () => {
    const form = component.registerForm;
    form.get("email")?.setValue("invalid-email");
    form.get("email")?.markAsTouched();
    fixture.detectChanges();

    const emailErrorMsg = fixture.debugElement.queryAll(By.css(".error-message")).find(de => de.nativeElement.textContent.includes("Please enter a valid email address"));
    expect(emailErrorMsg).toBeTruthy();
    if (emailErrorMsg) {
      expect(emailErrorMsg.nativeElement.textContent).toContain("Please enter a valid email address");
    }
  });

  it("must show an error if the password does not match the pattern", () => {
    const form = component.registerForm;
    form.get("password")?.setValue("invalid1");
    form.get("password")?.markAsTouched();
    fixture.detectChanges();

    const errorMsgs = fixture.debugElement.queryAll(By.css(".error-message"));
    const patternError = errorMsgs.find(de => de.nativeElement.textContent.includes("Password must contain uppercase, lowercase, number and special character"));
    expect(patternError).toBeTruthy();
  });

  it("must call authService.register when the form is valid", () => {
    const form = component.registerForm;
    form.get("email")?.setValue("test@example.com");
    form.get("password")?.setValue("Valid@123");
    form.get("confirmPassword")?.setValue("Valid@123");
    form.get("firstName")?.setValue("John");
    form.get("lastName")?.setValue("Doe");

    authServiceMock.register.and.returnValue(of({}));

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Valid@123",
      confirmPassword: "Valid@123",
      firstName: "John",
      lastName: "Doe"
    });
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith("Registration successful! Please check your email to confirm your account.");
    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });

  it("must show an error if authService.register returns an error", () => {
    const form = component.registerForm;
    form.get("email")?.setValue("test@example.com");
    form.get("password")?.setValue("Valid@123");
    form.get("confirmPassword")?.setValue("Valid@123");
    form.get("firstName")?.setValue("John");
    form.get("lastName")?.setValue("Doe");

    authServiceMock.register.and.returnValue(throwError({ status: 409 }));

    component.onSubmit();

    expect(authServiceMock.register).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "Valid@123",
      confirmPassword: "Valid@123",
      firstName: "John",
      lastName: "Doe"
    });
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("An account with this email already exists.");
  });

  it("must be invalid if the passwords do not match", () => {
    const form = component.registerForm;
    form.get("password")?.setValue("Valid@123");
    form.get("confirmPassword")?.setValue("Different@123");
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(form.get("confirmPassword")?.errors?.["passwordMismatch"]).toBeTrue();
  });

  it("must navigate to login when navigateToLogin is called", () => {
    component.navigateToLogin();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });
});
