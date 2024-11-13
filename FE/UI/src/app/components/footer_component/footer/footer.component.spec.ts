import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FooterComponent } from "./footer.component";
import { SearchService } from "../../../shared/services/search.service";
import { BehaviorSubject } from "rxjs";
import { provideRouter } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

// Mock class for SearchService
class MockSearchService {
  private sortOptionSubject = new BehaviorSubject<string>("");
  sortOption$ = this.sortOptionSubject.asObservable();

  private selectedCategorySubject = new BehaviorSubject<string>("");
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  setSortOption(option: string) {
    this.sortOptionSubject.next(option);
  }

  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }
}

describe("FooterComponent", () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let mockSearchService: MockSearchService;

  beforeEach(async () => {
    mockSearchService = new MockSearchService();

    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [FontAwesomeModule],
      providers: [{ provide: SearchService, useValue: mockSearchService }, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to verify component creation
  it("should create FooterComponent", () => {
    expect(component).toBeTruthy();
  });

  // Test for FontAwesome icons availability
  it("should have all FontAwesome icons defined", () => {
    expect(component.faPhone).toBeDefined();
    expect(component.faEnvelope).toBeDefined();
    expect(component.faInfoCircle).toBeDefined();
    expect(component.faMapMarkerAlt).toBeDefined();
    expect(component.faInstagram).toBeDefined();
    expect(component.faFacebook).toBeDefined();
    expect(component.faLinkedin).toBeDefined();
  });

  // Test for iconColors property
  it("should have icon color classes", () => {
    expect(component.iconColors).toBe("text-white");
  });

  // Test for sortBy method
  it("should call setSortOption on sortBy", () => {
    const sortOption = "price";
    const spy = spyOn(mockSearchService, "setSortOption");
    component.sortBy(sortOption);
    expect(spy).toHaveBeenCalledWith(sortOption);
  });

  // Test for filterByCategory method
  it("should call setSelectedCategory on filterByCategory", () => {
    const category = "Electronics";
    const spy = spyOn(mockSearchService, "setSelectedCategory");
    component.filterByCategory(category);
    expect(spy).toHaveBeenCalledWith(category);
  });

  // Test for footerClasses getter
  it("should return correct classes for footer", () => {
    const classes = component.footerClasses;
    expect(classes).toEqual({ "footer-visible": true });
  });
});
