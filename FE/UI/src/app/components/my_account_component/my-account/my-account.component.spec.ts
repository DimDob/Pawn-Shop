// UI/src/app/components/my_account_component/my-account/my-account.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { MyAccountComponent } from "./my-account.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../../app.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NoopAnimationsModule } from "@angular/platform-browser/animations"; // Добавен импорт

// Mock for AuthService
class MockAuthService {
  verifyPassword(currentPassword: string) {
    if (currentPassword === "correct_password") {
      return of(true);
    } else if (currentPassword === "error_password") {
      return throwError(() => new Error("Error verifying password"));
    } else {
      return of(false);
    }
  }

  getCurrentUser() {
    return {
      id: 1,
      loginUsername: "testuser",
      isAdmin: false,
      isEmployee: false,
      role: "user"
    };
  }

  // Новата функция updateUserAccount
  updateUserAccount(data: any) {
    console.log("MockAuthService: updateUserAccount called with", data);
    return of({ success: true });
  }
}

// Mock for Router
class MockRouter {
  navigate = jasmine.createSpy("navigate");
}

describe("MyAccountComponent", () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    mockAuthService = new MockAuthService();
    mockRouter = new MockRouter();
    formBuilder = new FormBuilder();

    await TestBed.configureTestingModule({
      declarations: [MyAccountComponent],
      imports: [ReactiveFormsModule, FontAwesomeModule, NoopAnimationsModule], // Добавен NoopAnimationsModule
      providers: [{ provide: AuthService, useValue: mockAuthService }, { provide: Router, useValue: mockRouter }, FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test for component creation
  it("should create MyAccountComponent", () => {
    expect(component).toBeTruthy();
  });

  // Test for form initialization
  it("should initialize the form correctly", () => {
    expect(component.myAccountForm).toBeDefined();
    const formValues = {
      username: "",
      email: "testuser", // Променено от '' на 'testuser'
      shopAddress: "",
      currentPassword: ""
    };
    expect(component.myAccountForm.value).toEqual(formValues);
  });

  // Test for form validity when required fields are empty
  it("should be invalid if required fields are empty", () => {
    component.myAccountForm.controls["username"].setValue("");
    component.myAccountForm.controls["email"].setValue("");
    component.myAccountForm.controls["shopAddress"].setValue("");
    component.myAccountForm.controls["currentPassword"].setValue("");
    expect(component.myAccountForm.invalid).toBeTrue();
  });

  // Test for form validity with valid inputs
  it("should be valid if all fields are filled correctly", () => {
    component.myAccountForm.controls["username"].setValue("testuser");
    component.myAccountForm.controls["email"].setValue("test@example.com");
    component.myAccountForm.controls["shopAddress"].setValue("123 Main St");
    component.myAccountForm.controls["currentPassword"].setValue("correct_password");
    expect(component.myAccountForm.valid).toBeTrue();
  });

  // Test to call verifyPassword on form submit with valid data
  it("should call verifyPassword on submitting a valid form", fakeAsync(() => {
    const spy = spyOn(mockAuthService, "verifyPassword").and.callThrough();

    component.myAccountForm.controls["username"].setValue("testuser");
    component.myAccountForm.controls["email"].setValue("test@example.com");
    component.myAccountForm.controls["shopAddress"].setValue("123 Main St");
    component.myAccountForm.controls["currentPassword"].setValue("correct_password");

    component.onSubmit();
    tick();

    expect(spy).toHaveBeenCalledWith("correct_password");
    expect(component.errorMessage).toBe("");
  }));

  // Test for successful data update with correct password
  it("should show success message on correct password", fakeAsync(() => {
    spyOn(window, "alert");

    component.myAccountForm.controls["username"].setValue("testuser");
    component.myAccountForm.controls["email"].setValue("test@example.com");
    component.myAccountForm.controls["shopAddress"].setValue("123 Main St");
    component.myAccountForm.controls["currentPassword"].setValue("correct_password");

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe("");
    expect(window.alert).toHaveBeenCalledWith("Account details updated successfully");
  }));

  // Test for showing error on incorrect current password
  it("should show error on incorrect current password", fakeAsync(() => {
    component.myAccountForm.controls["username"].setValue("testuser");
    component.myAccountForm.controls["email"].setValue("test@example.com");
    component.myAccountForm.controls["shopAddress"].setValue("123 Main St");
    component.myAccountForm.controls["currentPassword"].setValue("wrong_password");

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe("Incorrect current password");
  }));

  // Test for showing error on verifyPassword error
  it("should show error on verifyPassword error", fakeAsync(() => {
    component.myAccountForm.controls["username"].setValue("testuser");
    component.myAccountForm.controls["email"].setValue("test@example.com");
    component.myAccountForm.controls["shopAddress"].setValue("123 Main St");
    component.myAccountForm.controls["currentPassword"].setValue("error_password");

    component.onSubmit();
    tick();

    expect(component.errorMessage).toBe("Error verifying password");
  }));

  // Test for navigation to password change page
  it("should navigate to change password page on onChangePassword", () => {
    component.onChangePassword();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/my-account/change-password"]);
  });

  // Test for FontAwesome icon availability
  it("should have faUser icon", () => {
    expect(component.faUser).toBeDefined();
  });
});
