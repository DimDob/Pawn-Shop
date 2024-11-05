// UI/src/app/components/details_page_component/details-page/details-page.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DetailsPageComponent } from "./details-page.component";
import { ActivatedRoute } from "@angular/router";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { of } from "rxjs";
import { provideRouter } from "@angular/router";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Category } from "../../main_page_component/main-page/enums/Category";

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
      id: "a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "746d68ff-1002-4c71-82e0-177a648ef988",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "new"
    },
    {
      id: "b2c3d4e5-f6a7-8b9c-0d1e-f2a3b4c5d6e7",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes owner",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "8d4b1779-dc8e-44a8-8b8f-5b1bc1a96b91",
      quantityInStock: 2,
      isRunOutOfStock: false,
      condition: "new"
    },
    {
      id: "c3d4e5f6-a7b8-9c0d-1e2f-a3b4c5d6e7f8",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 300,
      ownerId: "d59e65b2-2c60-4529-a6e3-2c697d9144fa",
      quantityInStock: 3,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "d4e5f6a7-b8c9-0d1e-2f3a-b4c5d6e7f8a9",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes owner",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "dfc4953b-75f4-44a6-b25e-5b64aaaf2b96",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "e5f6a7b8-c9d0-1e2f-3a4b-c5d6e7f8a9b0",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 500,
      ownerId: "f9ac65ef-e508-4e26-a36b-5c6849f9a5f1",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "new"
    },
    {
      id: "f6a7b8c9-d0e1-2f3a-4b5c-d6e7f8a9b0c1",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "746d68ff-1002-4c71-82e0-177a648ef988",
      quantityInStock: 2,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "a7b8c9d0-e1f2-3a4b-5c6d-e7f8a9b0c1d2",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "8d4b1779-dc8e-44a8-8b8f-5b1bc1a96b91",
      quantityInStock: 2,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "b8c9d0e1-f2a3-4b5c-6d7e-f8a9b0c1d2e3",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes owner",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "d59e65b2-2c60-4529-a6e3-2c697d9144fa",
      quantityInStock: 2,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "c9d0e1f2-a3b4-5c6d-7e8f-a9b0c1d2e3f4",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "dfc4953b-75f4-44a6-b25e-5b64aaaf2b96",
      quantityInStock: 3,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "d0e1f2a3-b4c5-6d7e-8f9a-b0c1d2e3f4a5",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.JEWELRY,
      price: 100,
      ownerId: "f9ac65ef-e508-4e26-a36b-5c6849f9a5f1",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "new"
    },
    {
      id: "e1f2a3b4-c5d6-7e8f-9a0b-c1d2e3f4a5b6",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "746d68ff-1002-4c71-82e0-177a648ef988",
      quantityInStock: 4,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "f2a3b4c5-d6e7-8f9a-0b1c-d2e3f4a5b6c7",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "8d4b1779-dc8e-44a8-8b8f-5b1bc1a96b91",
      quantityInStock: 2,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "a3b4c5d6-e7f8-9a0b-1c2d-e3f4a5b6c7d8",
      picture: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Arduino_ftdi_chip-1.jpg",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.ELECTRONICS,
      price: 100,
      ownerId: "d59e65b2-2c60-4529-a6e3-2c697d9144fa",
      quantityInStock: 3,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "b4c5d6e7-f8a9-0b1c-2d3e-f4a5b6c7d8e9",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "dfc4953b-75f4-44a6-b25e-5b64aaaf2b96",
      quantityInStock: 2,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "c5d6e7f8-a9b0-1c2d-3e4f-a5b6c7d8e9f0",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "f9ac65ef-e508-4e26-a36b-5c6849f9a5f1",
      quantityInStock: 3,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "d6e7f8a9-b0c1-2d3e-4f5a-b6c7d8e9f0a1",
      picture: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Fingerring_av_guld_med_rubin_och_rosenstenar%2C_1700-tal_-_Hallwylska_museet_-_110184.tif/lossy-page1-1280px-Fingerring_av_guld_med_rubin_och_rosenstenar%2C_1700-tal_-_Hallwylska_museet_-_110184.tif.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.JEWELRY,
      price: 100,
      ownerId: "746d68ff-1002-4c71-82e0-177a648ef988",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "e7f8a9b0-c1d2-3e4f-5a6b-c7d8e9f0a1b2",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "8d4b1779-dc8e-44a8-8b8f-5b1bc1a96b91",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "f8a9b0c1-d2e3-4f5a-6b7c-d8e9f0a1b2c3",
      picture: "https://upload.wikimedia.org/wikipedia/en/3/34/GuyLaroche_suit_jacket_83d40m_black_skirt_late1959_early1960_vintage.png",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "d59e65b2-2c60-4529-a6e3-2c697d9144fa",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "a9b0c1d2-e3f4-5a6b-7c8d-e9f0a1b2c3d4",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "746d68ff-1002-4c71-82e0-177a648ef988",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "b0c1d2e3-f4a5-6b7c-8d9e-f0a1b2c3d4e5",
      picture: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.ART,
      price: 100,
      ownerId: "8d4b1779-dc8e-44a8-8b8f-5b1bc1a96b91",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "c1d2e3f4-a5b6-7c8d-9e0f-a1b2c3d4e5f6",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "d59e65b2-2c60-4529-a6e3-2c697d9144fa",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "d2e3f4a5-b6c7-8d9e-0f1a-b2c3d4e5f6a7",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "dfc4953b-75f4-44a6-b25e-5b64aaaf2b96",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "e3f4a5b6-c7d8-9e0f-1a2b-c3d4e5f6a7b8",
      picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "8d4b1779-dc8e-44a8-8b8f-5b1bc1a96b91",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "f4a5b6c7-d8e9-0f1a-2b3c-d4e5f6a7b8c9",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "d59e65b2-2c60-4529-a6e3-2c697d9144fa",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "like new"
    },
    {
      id: "a5b6c7d8-e9f0-1a2b-3c4d-e5f6a7b8c9d0",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "blue",
      size: 12,
      sex: "male",
      manufacturer: "Nike",
      model: "Air Max",
      name: "Nike Air Max",
      category: Category.OTHER,
      price: 100,
      ownerId: "dfc4953b-75f4-44a6-b25e-5b64aaaf2b96",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "used"
    },
    {
      id: "b6c7d8e9-f0a1-2b3c-4d5e-f6a7b8c9d0e1",
      picture: "https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg",
      color: "black",
      size: 13,
      sex: "female",
      manufacturer: "Adidas",
      model: "Spezial Shoes",
      name: "Adidas Spezial Shoes",
      category: Category.CLOTHING,
      price: 100,
      ownerId: "746d68ff-1002-4c71-82e0-177a648ef988",
      quantityInStock: 1,
      isRunOutOfStock: false,
      condition: "like new"
    }
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
