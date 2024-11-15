// UI\src\app\components\main_page_component\main-page\main-page.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MainPageComponent } from "./main-page.component";
import { ProductService } from "../../../shared/services/product.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { SearchService } from "../../../shared/services/search.service";
import { ErrorHandlerService } from "../../../shared/services/error-handler.service";
import { Router } from "@angular/router";
import { of, throwError, BehaviorSubject } from "rxjs";
import { Products } from "./Interfaces/Products";
import { Category } from "./enums/Category";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";

describe("MainPageComponent", () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let productServiceMock: any;
  let cartServiceMock: any;
  let searchServiceMock: any;
  let errorHandlerServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj("ProductService", ["getAllProducts"]);
    cartServiceMock = jasmine.createSpyObj("CartService", ["addToCart"]);
    searchServiceMock = {
      searchTerm$: new BehaviorSubject<string>(""),
      selectedCategory$: new BehaviorSubject<string>(""),
      sortOption$: new BehaviorSubject<string>(""),
      setSearchTerm: jasmine.createSpy("setSearchTerm"),
      setSelectedCategory: jasmine.createSpy("setSelectedCategory"),
      setSortOption: jasmine.createSpy("setSortOption")
    };
    errorHandlerServiceMock = jasmine.createSpyObj("ErrorHandlerService", ["handleError"]);
    routerMock = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [MainPageComponent],
      imports: [MatPaginatorModule, MatFormFieldModule, MatSelectModule, BrowserAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
  });

  it("must create the component", () => {
    // Check if the component is created successfully
    expect(component).toBeTruthy();
  });

  it("must load products on initialization", () => {
    const mockProducts: Products[] = [
      {
        id: "1",
        picture: "image1.jpg",
        name: "Product 1",
        category: Category.ELECTRONICS,
        price: 100,
        productTypeId: "type1",
        createdAt: "2024-01-01",
        description: "Description 1"
      },
      {
        id: "2",
        picture: "image2.jpg",
        name: "Product 2",
        category: Category.CLOTHING,
        price: 200,
        productTypeId: "type2",
        createdAt: "2024-02-01",
        description: "Description 2"
      }
    ];

    productServiceMock.getAllProducts.and.returnValue(of(mockProducts));

    // Call ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Check if products are loaded correctly
    expect(productServiceMock.getAllProducts).toHaveBeenCalled();
    expect(component["products"]()).toEqual(mockProducts);
    expect(component["filteredProducts"]()).toEqual(mockProducts);
    expect(component["totalProducts"]()).toEqual(mockProducts.length);
  });

  it("must handle error when products fail to load", () => {
    const errorResponse = new Error("Failed to load");

    productServiceMock.getAllProducts.and.returnValue(throwError(() => errorResponse));
    errorHandlerServiceMock.handleError.and.returnValue(throwError(() => errorResponse));

    // Call ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Check if the error is handled correctly
    expect(productServiceMock.getAllProducts).toHaveBeenCalled();
    expect(errorHandlerServiceMock.handleError).toHaveBeenCalledWith(errorResponse);
  });

  it("must navigate to product details on click", () => {
    const productId = "123";

    // Call the method via bracket notation
    component["goToDetails"](productId);

    // Check if navigation is called with the correct parameters
    expect(routerMock.navigate).toHaveBeenCalledWith(["/product", productId]);
  });

  it("must add a product to the cart on purchase request", () => {
    const mockProduct: Products = {
      id: "1",
      picture: "image1.jpg",
      name: "Product 1",
      category: Category.ELECTRONICS,
      price: 100,
      productTypeId: "type1",
      createdAt: "2024-01-01",
      description: "Description 1"
    };

    // Call the method
    component["requestPurchase"](mockProduct);

    // Check if the product is added to the cart
    expect(cartServiceMock.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it("must change the view from Grid to List and vice versa", () => {
    // Initial view is Grid
    expect(component["isGridView"]()).toBeTrue();

    // Change the view
    component["toggleView"]();
    expect(component["isGridView"]()).toBeFalse();

    // Return to Grid view
    component["toggleView"]();
    expect(component["isGridView"]()).toBeTrue();
  });

  it("must apply filters correctly", () => {
    const mockFilteredProducts: Products[] = [
      {
        id: "1",
        picture: "image1.jpg",
        name: "Filtered Product 1",
        category: Category.JEWELRY,
        price: 150,
        productTypeId: "type3",
        createdAt: "2024-03-01",
        description: "Description 1"
      }
    ];

    productServiceMock.getAllProducts.and.returnValue(of(mockFilteredProducts));

    // Set up the filters
    component["selectedSortOption"].set("priceLowToHigh");
    component["selectedCategory"].set(Category.JEWELRY);
    component["searchTerm"].set("Filtered");

    // Call applyFilters
    component["applyFilters"]();
    fixture.detectChanges();

    // Check if the filters are applied correctly
    expect(productServiceMock.getAllProducts).toHaveBeenCalledWith("priceLowToHigh", Category.JEWELRY, "filtered");
    expect(component["products"]()).toEqual(mockFilteredProducts);
    expect(component["filteredProducts"]()).toEqual(mockFilteredProducts);
    expect(component["totalProducts"]()).toEqual(mockFilteredProducts.length);
  });

  it("must update the page when the paginator changes", () => {
    const mockPageEvent = {
      pageIndex: 1,
      pageSize: 50,
      length: 100
    } as PageEvent;

    // Set initial values
    component["pageIndex"].set(0);
    component["pageSize"].set(25);
    component["totalProducts"].set(100);

    // Call onPageChange
    component["onPageChange"](mockPageEvent);
    fixture.detectChanges();

    // Check if the values are updated
    expect(component["pageIndex"]()).toBe(1);
    expect(component["pageSize"]()).toBe(50);
    expect(localStorage.getItem("preferredPageSize")).toBe("50");
    expect(localStorage.getItem("currentPageIndex")).toBe("1");
  });

  it("must save the page size and index preferences when loading the component", () => {
    spyOn(localStorage, "getItem").and.callFake((key: string) => {
      if (key === "preferredPageSize") return "50";
      if (key === "currentPageIndex") return "2";
      return null;
    });

    component["loadStoredPreferences"]();

    expect(component["pageSize"]()).toBe(50);
    expect(component["pageIndex"]()).toBe(2);
  });

  it("must manage subscriptions when destroying the component", () => {
    spyOn(component["subscriptions"], "unsubscribe");

    component.ngOnDestroy();

    expect(component["subscriptions"].unsubscribe).toHaveBeenCalled();
  });
});
