// UI\src\app\app.component.spec.ts
import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";
import { ErrorHandlerService } from "./shared/services/error-handler.service";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
      providers: [
        { provide: "title", useValue: "auth" },
        { provide: ErrorHandlerService, useValue: {} }
      ]
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'auth'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual("auth");
  // });

  // it("should render title", () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector("h1")?.textContent).toContain("Hello, auth");
  // });
});
