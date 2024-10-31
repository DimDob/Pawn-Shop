// UI/src/app/components/main_page_component/main-page/main-page.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MainPageComponent } from "./main-page.component";
import { SeedDataService } from "./seedData/seed-data.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { SearchService } from "../../../shared/services/search.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { provideRouter } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // Добавяме BrowserAnimationsModule
import { of } from "rxjs";
import { Products } from "./Interfaces/Products";
import { PageEvent } from "@angular/material/paginator";
import { Category } from "./enums/Category";

describe("MainPageComponent", () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;
  let seedDataService: SeedDataService;
  let cartService: CartService;
  let searchService: SearchService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainPageComponent],
      imports: [HttpClientTestingModule, BrowserAnimationsModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatSelectModule],
      providers: [SeedDataService, CartService, SearchService, provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    seedDataService = TestBed.inject(SeedDataService);
    cartService = TestBed.inject(CartService);
    searchService = TestBed.inject(SearchService);

    // Мокаем данни за продукти
    seedDataService.products = [
      { id: "1", name: "Product1", category: Category.ELECTRONICS, model: "Model1", price: 100, picture: "", color: "", size: 0, sex: "male", manufacturer: "" },
      { id: "2", name: "Product2", category: Category.CLOTHING, model: "Model2", price: 200, picture: "", color: "", size: 0, sex: "female", manufacturer: "" }
    ] as Products[];
    component.products = seedDataService.products;
    component.filteredProducts = component.products;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should filter products based on search term", () => {
    component.searchTerm = "Product1";
    component.applyFilters();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe("Product1");
  });

  it("should filter products based on selected category", () => {
    component.selectedCategory = Category.ELECTRONICS;
    component.applyFilters();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].category).toBe(Category.ELECTRONICS);
  });

  it("should sort products by price ascending", () => {
    component.selectedSortOption = "priceAsc";
    component.applyFilters();
    expect(component.filteredProducts[0].price).toBe(100);
    expect(component.filteredProducts[1].price).toBe(200);
  });

  it("should paginate products based on page size", () => {
    component.pageSize = 1;
    component.pageIndex = 0;
    component.paginateProducts();
    expect(component.paginatedProducts.length).toBe(1);
    expect(component.paginatedProducts[0].name).toBe("Product1");

    component.pageIndex = 1;
    component.paginateProducts();
    expect(component.paginatedProducts[0].name).toBe("Product2");
  });

  it("should navigate to product details page", () => {
    spyOn(component["router"], "navigate");
    component.goToDetails("1");
    expect(component["router"].navigate).toHaveBeenCalledWith(["/product", "1"]);
  });

  it("should add a product to the cart", () => {
    spyOn(cartService, "addToCart");
    const product: Products = { id: "1", name: "Product1", category: Category.ELECTRONICS, model: "Model1", price: 100, picture: "", color: "", size: 0, sex: "male", manufacturer: "" };
    component.requestPurchase(product);
    expect(cartService.addToCart).toHaveBeenCalledWith(product);
  });

  it("should unsubscribe from subscriptions on destroy", () => {
    spyOn(component["subscriptions"], "unsubscribe");
    component.ngOnDestroy();
    expect(component["subscriptions"].unsubscribe).toHaveBeenCalled();
  });

  it("should update pageIndex and pageSize on page change", () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 5, length: 0 };
    component.onPageChange(pageEvent);
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
  });
});
