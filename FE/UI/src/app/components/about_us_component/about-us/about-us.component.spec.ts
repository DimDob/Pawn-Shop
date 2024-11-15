// UI\src\app\components\about_us_component\about-us\about-us.component.spec.ts
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AboutUsComponent } from "./about-us.component";
import { provideRouter } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

describe("AboutUsComponent", () => {
  let component: AboutUsComponent;
  let fixture: ComponentFixture<AboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutUsComponent],
      imports: [FontAwesomeModule],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("must create", () => {
    expect(component).toBeTruthy();
  });
});
