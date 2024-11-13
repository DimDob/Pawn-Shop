// UI/src/app/components/not-found_component/not-found/not-found.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NotFoundComponent } from "./not-found.component";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

describe("NotFoundComponent", () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let routerMock: any;
  let authServiceMock: any;

  beforeEach(async () => {
    // Create mocks for Router and AuthService
    routerMock = {
      navigate: jasmine.createSpy("navigate")
    };

    authServiceMock = {
      isLoggedIn: jasmine.createSpy("isLoggedIn")
    };

    // Configure the TestBed with necessary modules and providers
    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Create the component instance and trigger initial data binding
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the NotFoundComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should display the correct error message in the template", () => {
    const errorMessage: HTMLElement = fixture.debugElement.query(By.css("h1")).nativeElement;
    expect(errorMessage.textContent).toContain("The page you are looking for does not exist");
  });

  it("should display the description message in the template", () => {
    const description: HTMLElement = fixture.debugElement.query(By.css("p")).nativeElement;
    expect(description.textContent).toContain("It seems you've lost your way in the space. Let's help you get back.");
  });

  it("should navigate to the appropriate home page when navigateHome is called and user is logged in", () => {
    // Arrange: Mock AuthService to return true for isLoggedIn
    authServiceMock.isLoggedIn.and.returnValue(true);

    // Act: Call navigateHome
    component.navigateHome();

    // Assert: Router.navigate should be called with '/pawn-shop/main-page'
    expect(routerMock.navigate).toHaveBeenCalledWith(["/pawn-shop/main-page"]);
  });

  it("should navigate to the login page when navigateHome is called and user is not logged in", () => {
    // Arrange: Mock AuthService to return false for isLoggedIn
    authServiceMock.isLoggedIn.and.returnValue(false);

    // Act: Call navigateHome
    component.navigateHome();

    // Assert: Router.navigate should be called with '/auth/login'
    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });

  it("should call window.history.back() when goBack is called", () => {
    // Spy on window.history.back
    spyOn(window.history, "back");

    // Act: Call goBack
    component.goBack();

    // Assert: window.history.back should have been called
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should navigate to login when "Back" button is clicked', () => {
    // Arrange: Spy on component's goBack method
    spyOn(component, "goBack");

    // Act: Find the "Back" button and trigger a click event
    const backButton: DebugElement = fixture.debugElement.query(By.css(".back-button"));
    backButton.triggerEventHandler("click", null);

    // Assert: goBack method should have been called
    expect(component.goBack).toHaveBeenCalled();
  });

  it('should navigate home when "Home" button is clicked and user is logged in', () => {
    // Arrange: Mock AuthService to return true for isLoggedIn
    authServiceMock.isLoggedIn.and.returnValue(true);

    // Act: Find the "Home" button and trigger a click event
    const homeButton: DebugElement = fixture.debugElement.query(By.css(".home-button"));
    homeButton.triggerEventHandler("click", null);

    // Assert: Router.navigate should have been called with '/pawn-shop/main-page'
    expect(routerMock.navigate).toHaveBeenCalledWith(["/pawn-shop/main-page"]);
  });

  it('should navigate to login when "Home" button is clicked and user is not logged in', () => {
    // Arrange: Mock AuthService to return false for isLoggedIn
    authServiceMock.isLoggedIn.and.returnValue(false);

    // Act: Find the "Home" button and trigger a click event
    const homeButton: DebugElement = fixture.debugElement.query(By.css(".home-button"));
    homeButton.triggerEventHandler("click", null);

    // Assert: Router.navigate should have been called with '/auth/login'
    expect(routerMock.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });
});
