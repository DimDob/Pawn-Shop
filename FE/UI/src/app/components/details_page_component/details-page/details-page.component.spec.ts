// UI/src/app/components/details_page_component/details-page/details-page.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DetailsPageComponent } from "./details-page.component";
import { ActivatedRoute } from "@angular/router";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { of } from "rxjs";
import { provideRouter } from "@angular/router";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";

// Mock for ActivatedRoute
class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: (key: string) => {
        if (key === "id") {
          return "1";
        }
        return null;
      }
    }
  };
}

// Mock for SeedDataService
class MockSeedDataService {
  public products: Products[] = [
    {
      id: 1,
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male", // Строго тип "male"
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: "Clothes",
      price: 100
    }
    // You can add more Products if needed
  ];
}

// Mock for CartService
class MockCartService {
  addToCart(product: any, quantity: number = 1) {
    // Empty method for spying
  }
}

describe("DetailsPageComponent", () => {
  let component: DetailsPageComponent;
  let fixture: ComponentFixture<DetailsPageComponent>;
  let mockCartService: MockCartService;
  let mockSeedDataService: MockSeedDataService;
  let mockActivatedRoute: MockActivatedRoute;

  beforeEach(async () => {
    mockCartService = new MockCartService();
    mockSeedDataService = new MockSeedDataService();
    mockActivatedRoute = new MockActivatedRoute();

    await TestBed.configureTestingModule({
      declarations: [DetailsPageComponent],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }, { provide: SeedDataService, useValue: mockSeedDataService }, { provide: CartService, useValue: mockCartService }, provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("must create DetailsPageComponent", () => {
    expect(component).toBeTruthy();
  });

  it("must initialize the product correctly in ngOnInit", () => {
    expect(component.product).toEqual(mockSeedDataService.products[0]);
  });

  it("must call addToCart on CartService when adding to cart", () => {
    const spy = spyOn(mockCartService, "addToCart");
    component.quantity = 2;
    component.addToCart();
    expect(spy).toHaveBeenCalledWith(mockSeedDataService.products[0], 2);
  });

  it("must call addToCart with quantity 1 by default", () => {
    const spy = spyOn(mockCartService, "addToCart");
    component.addToCart();
    expect(spy).toHaveBeenCalledWith(mockSeedDataService.products[0], 1);
  });

  it("must add a product with quantity 0 or less", () => {
    const spy = spyOn(mockCartService, "addToCart");
    component.quantity = 0;
    component.addToCart();
    expect(spy).toHaveBeenCalledWith(mockSeedDataService.products[0], 0);
  });
});
