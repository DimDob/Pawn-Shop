// UI\src\app\components\contacts_component\contacts\contacts.component.spec.ts
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ContactsComponent } from "./contacts.component";
import { provideRouter } from "@angular/router";

describe("ContactsComponent", () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactsComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("must create", () => {
    expect(component).toBeTruthy();
  });
});
