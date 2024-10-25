// UI/src/app/components/contacts_component/contacts/contacts.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ContactsComponent } from "../../contacts_component/contacts/contacts.component";

describe("ContactsComponent", () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ContactsComponent],
      imports: [],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("must create ContactsComponent", () => {
    expect(component).toBeTruthy();
  });
});
