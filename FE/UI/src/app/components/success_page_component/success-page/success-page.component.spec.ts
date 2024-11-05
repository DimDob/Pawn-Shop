// UI/src/app/components/success_page_component/success-page/success-page.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SuccessPageComponent } from "./success-page.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome"; // Added if the component uses FontAwesome icons
import { RouterTestingModule } from "@angular/router/testing"; // Added if there is navigation

describe("SuccessPageComponent", () => {
  let component: SuccessPageComponent;
  let fixture: ComponentFixture<SuccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessPageComponent],
      imports: [
        FontAwesomeModule, // Included if FontAwesome icons are used
        RouterTestingModule // Included if the component uses Router
      ],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to verify component creation
  it("should create the SuccessPageComponent", () => {
    expect(component).toBeTruthy();
  });

  // Additional tests can be added here if the component gains more logic or elements in the future
});
