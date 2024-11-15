// UI/src/app/components/success_page_component/success-page/success-page.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SuccessPageComponent } from "./success-page.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterTestingModule } from "@angular/router/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

describe("SuccessPageComponent", () => {
  let component: SuccessPageComponent;
  let fixture: ComponentFixture<SuccessPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessPageComponent],
      imports: [FontAwesomeModule, RouterTestingModule, NoopAnimationsModule],
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
