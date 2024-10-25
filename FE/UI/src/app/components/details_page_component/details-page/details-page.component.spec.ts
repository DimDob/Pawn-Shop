// UI/src/app/components/details_page_component/details-page/details-page.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DetailsPageComponent } from "./details-page.component";
import { ActivatedRoute } from "@angular/router";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { of } from "rxjs";
import { provideRouter } from "@angular/router";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";

// Мока за ActivatedRoute
class MockActivatedRoute {
  snapshot = {
    paramMap: {
      get: (key: string) => {
        if (key === "id") {
          return "1"; // Връща ID за тест
        }
        return null;
      }
    }
  };
}

// Мока за SeedDataService
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
    // Можете да добавите повече продукти ако е необходимо
  ];
}

// Мока за CartService
class MockCartService {
  addToCart(product: any, quantity: number = 1) {
    // Празен метод за спайване
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
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SeedDataService, useValue: mockSeedDataService },
        { provide: CartService, useValue: mockCartService },
        provideRouter([]) // Използване на provideRouter вместо RouterTestingModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Тест за създаване на компонента
  it("трябва да се създаде DetailsPageComponent", () => {
    expect(component).toBeTruthy();
  });

  // Тест за инициализиране на продукта в ngOnInit
  it("трябва да инициализира правилно продукта в ngOnInit", () => {
    expect(component.product).toEqual(mockSeedDataService.products[0]);
  });

  // Тест за добавяне на продукт към количката
  it("трябва да извика addToCart на CartService при добавяне към количката", () => {
    const spy = spyOn(mockCartService, "addToCart");
    component.quantity = 2;
    component.addToCart();
    expect(spy).toHaveBeenCalledWith(mockSeedDataService.products[0], 2);
  });

  // Тест за добавяне на продукт със стандартно количество
  it("трябва да извика addToCart с количество 1 по подразбиране", () => {
    const spy = spyOn(mockCartService, "addToCart");
    component.addToCart();
    expect(spy).toHaveBeenCalledWith(mockSeedDataService.products[0], 1);
  });

  // Тест за добавяне на продукт, когато количеството е нула или по-малко
  it("трябва да добави продукт с количество 0 или по-малко", () => {
    const spy = spyOn(mockCartService, "addToCart");
    component.quantity = 0;
    component.addToCart();
    expect(spy).toHaveBeenCalledWith(mockSeedDataService.products[0], 0);
  });
});
