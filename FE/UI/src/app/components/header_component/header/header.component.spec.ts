// UI/src/app/components/header_component/header/header.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { SearchService } from "../../../shared/services/search.service";
import { BehaviorSubject } from "rxjs";
import { provideRouter } from "@angular/router";
import { Router, NavigationEnd } from "@angular/router";

class MockCartService {
  private itemsSubject = new BehaviorSubject<{ product: any; quantity: number }[]>([]);
  items$ = this.itemsSubject.asObservable();

  addToCart(product: any, quantity: number = 1) {
    const items = this.itemsSubject.getValue();
    const existingItem = items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.itemsSubject.next(items);
  }

  removeFromCart(productId: number) {
    let items = this.itemsSubject.getValue();
    items = items.filter(item => item.product.id !== productId);
    this.itemsSubject.next(items);
  }

  updateQuantity(productId: number, quantity: number) {
    const items = this.itemsSubject.getValue();
    const item = items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.itemsSubject.next(items);
      }
    }
  }

  clearCart() {
    this.itemsSubject.next([]);
  }

  getTotalCost(): number {
    const items = this.itemsSubject.getValue();
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}

class MockSearchService {
  private searchTermSubject = new BehaviorSubject<string>("");
  searchTerm$ = this.searchTermSubject.asObservable();

  private selectedCategorySubject = new BehaviorSubject<string>("");
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  private sortOptionSubject = new BehaviorSubject<string>("");
  sortOption$ = this.sortOptionSubject.asObservable();

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }

  setSortOption(option: string) {
    this.sortOptionSubject.next(option);
  }
}

class MockRouter {
  private eventsSubject = new BehaviorSubject<any>(null);
  events = this.eventsSubject.asObservable();

  navigate(url: string) {
    this.eventsSubject.next(new NavigationEnd(1, url, url));
  }
}

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockCartService: MockCartService;
  let mockSearchService: MockSearchService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockCartService = new MockCartService();
    mockSearchService = new MockSearchService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [{ provide: CartService, useValue: mockCartService }, { provide: SearchService, useValue: mockSearchService }, { provide: Router, useValue: mockRouter }, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("must create HeaderComponent", () => {
    expect(component).toBeTruthy();
  });

  it("must update cartItemCount when cart changes", () => {
    mockCartService.addToCart({ id: 1, price: 100 }, 2);
    fixture.detectChanges();
    expect(component.cartItemCount).toBe(2);
  });

  it("must determine if the current page is the cart page", () => {
    mockRouter.navigate("/cart");
    fixture.detectChanges();
    expect(component.isCartPage).toBeTrue();
  });

  it("must call setSelectedCategory when the category changes", () => {
    const spy = spyOn(mockSearchService, "setSelectedCategory");
    component.onCategoryChange("Electronics");
    expect(spy).toHaveBeenCalledWith("Electronics");
  });

  it("must call setSearchTerm when searching", () => {
    const spy = spyOn(mockSearchService, "setSearchTerm");
    component.searchTerm = "Laptop";
    component.onSearch();
    expect(spy).toHaveBeenCalledWith("Laptop");
  });
});
