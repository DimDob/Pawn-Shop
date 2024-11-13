// UI/src/app/components/auth_component/confirm-email/confirm-email.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { ConfirmEmailComponent } from "./confirm-email.component";
import { AuthService } from "../../../app.service";
import { Router, ActivatedRoute } from "@angular/router";
import { of, throwError } from "rxjs";
import { By } from "@angular/platform-browser";

describe("ConfirmEmailComponent", () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;
  let authServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Create mocks for the dependencies
    authServiceMock = {
      confirmEmail: jasmine.createSpy("confirmEmail")
    };

    routerMock = {
      navigate: jasmine.createSpy("navigate")
    };

    activatedRouteMock = {
      snapshot: {
        queryParamMap: {
          get: jasmine.createSpy("get")
        }
      }
    };

    // Configure the TestBed with necessary modules and providers
    await TestBed.configureTestingModule({
      declarations: [ConfirmEmailComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Create the component instance and trigger initial data binding
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the ConfirmEmailComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should set confirmationStatus to error if no token is provided", () => {
    // Arrange: Mock ActivatedRoute to return null for token
    activatedRouteMock.snapshot.queryParamMap.get.and.returnValue(null);

    // Act: Call ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(component.confirmationStatus).toBe("error");
    expect(component.errorMessage).toBe("Invalid confirmation link");

    // Check if the error message is displayed in the template
    const errorElement = fixture.debugElement.query(By.css(".error p"));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain("Invalid confirmation link");
  });

  it("should set confirmationStatus to confirming initially and call AuthService.confirmEmail with token", () => {
    // Arrange: Mock ActivatedRoute to return a valid token
    const mockToken = "validToken123";
    activatedRouteMock.snapshot.queryParamMap.get.and.returnValue(mockToken);
    authServiceMock.confirmEmail.and.returnValue(of({}));

    // Act: Call ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(component.confirmationStatus).toBe("success");
    expect(authServiceMock.confirmEmail).toHaveBeenCalledWith(mockToken);
  });

  it("should set confirmationStatus to success on successful email confirmation", fakeAsync(() => {
    // Arrange: Mock ActivatedRoute to return a valid token and AuthService to return success
    const mockToken = "validToken123";
    activatedRouteMock.snapshot.queryParamMap.get.and.returnValue(mockToken);
    authServiceMock.confirmEmail.and.returnValue(of({}));

    // Act: Call ngOnInit and simulate async
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Assert
    expect(component.confirmationStatus).toBe("success");

    // Check if the success message is displayed
    const successElement = fixture.debugElement.query(By.css(".success h2"));
    expect(successElement).toBeTruthy();
    expect(successElement.nativeElement.textContent).toContain("Email Confirmed Successfully!");
  }));

  it("should set confirmationStatus to error and display error message on failed email confirmation", fakeAsync(() => {
    // Arrange: Mock ActivatedRoute to return a valid token and AuthService to return an error
    const mockToken = "invalidToken123";
    activatedRouteMock.snapshot.queryParamMap.get.and.returnValue(mockToken);
    const mockError = { status: 400, error: { message: "Invalid token" } };
    authServiceMock.confirmEmail.and.returnValue(throwError(mockError));

    // Act: Call ngOnInit and simulate async
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Assert
    expect(component.confirmationStatus).toBe("error");
    expect(component.errorMessage).toBe("Invalid token");

    // Check if the error message is displayed in the template
    const errorElement = fixture.debugElement.query(By.css(".error h2"));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain("Email Confirmation Failed");

    const errorMsgElement = fixture.debugElement.query(By.css(".error p"));
    expect(errorMsgElement).toBeTruthy();
    expect(errorMsgElement.nativeElement.textContent).toContain("Invalid token");
  }));

  it("should set confirmationStatus to success if error has status 200", fakeAsync(() => {
    // Arrange: Mock ActivatedRoute to return a valid token and AuthService to return an error with status 200
    const mockToken = "validToken123";
    activatedRouteMock.snapshot.queryParamMap.get.and.returnValue(mockToken);
    const mockError = { status: 200 };
    authServiceMock.confirmEmail.and.returnValue(throwError(mockError));

    // Act: Call ngOnInit and simulate async
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Assert
    expect(component.confirmationStatus).toBe("success");
  }));

  it("should navigate to login when navigateToLogin is called", () => {
    // Act: Call navigateToLogin
    component.navigateToLogin();

    // Assert: Router.navigate should be called with the correct path
    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });

  it("should display the confirming message and spinner when confirmationStatus is confirming", () => {
    // Arrange: Set confirmationStatus to 'confirming'
    component.confirmationStatus = "confirming";
    fixture.detectChanges();

    // Act: Query the DOM for confirming elements
    const confirmingElement = fixture.debugElement.query(By.css(".confirming h2"));
    const spinnerElement = fixture.debugElement.query(By.css(".confirming .spinner"));

    // Assert
    expect(confirmingElement).toBeTruthy();
    expect(confirmingElement.nativeElement.textContent).toContain("Confirming your email...");
    expect(spinnerElement).toBeTruthy();
  });

  it("should display the success message and button when confirmationStatus is success", () => {
    // Arrange: Set confirmationStatus to 'success'
    component.confirmationStatus = "success";
    fixture.detectChanges();

    // Act: Query the DOM for success elements
    const successElement = fixture.debugElement.query(By.css(".success h2"));
    const successMsgElement = fixture.debugElement.query(By.css(".success p"));
    const buttonElement = fixture.debugElement.query(By.css(".success button"));

    // Assert
    expect(successElement).toBeTruthy();
    expect(successElement.nativeElement.textContent).toContain("Email Confirmed Successfully!");
    expect(successMsgElement).toBeTruthy();
    expect(successMsgElement.nativeElement.textContent).toContain("Your email has been confirmed. You can now log in to your account.");
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.nativeElement.textContent).toContain("Go to Login");
  });

  it("should display the error message and button when confirmationStatus is error", () => {
    // Arrange: Set confirmationStatus to 'error' and provide an error message
    component.confirmationStatus = "error";
    component.errorMessage = "Failed to confirm email";
    fixture.detectChanges();

    // Act: Query the DOM for error elements
    const errorElement = fixture.debugElement.query(By.css(".error h2"));
    const errorMsgElement = fixture.debugElement.query(By.css(".error p"));
    const buttonElement = fixture.debugElement.query(By.css(".error button"));

    // Assert
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain("Email Confirmation Failed");
    expect(errorMsgElement).toBeTruthy();
    expect(errorMsgElement.nativeElement.textContent).toContain("Failed to confirm email");
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.nativeElement.textContent).toContain("Return to Login");
  });
});
