// UI\src\app\components\cart_page_component\cart-page\cart-page.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { CartPageComponent } from "./cart-page.component";
import { CartService } from "./cart.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { provideRouter, Routes } from "@angular/router";
import { Component } from "@angular/core";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NotificationService } from "../../../shared/services/notification.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
  template: ""
})
class SuccessComponent {}

@Component({
  template: ""
})
class OrderSummaryComponent {}

const routes: Routes = [
  { path: "success", component: SuccessComponent },
  { path: "order-summary", component: OrderSummaryComponent }
];

describe("CartPageComponent", () => {
  let component: CartPageComponent;
  let fixture: ComponentFixture<CartPageComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: Router;

  const mockProducts = {
    id: "1",
    picture: "test.jpg",
    color: "blue",
    size: 42,
    sex: "male" as const,
    manufacturer: "Nike",
    model: "Air Max",
    name: "Test Shoe",
    category: "Clothing",
    price: 100,
    productTypeId: "1",
    createdAt: "2024-01-01",
    description: "Description 1"
  };

  const mockCartItems = [{ product: mockProducts, quantity: 2 }];

  beforeEach(async () => {
    cartService = jasmine.createSpyObj("CartService", ["updateQuantity", "removeFromCart", "clearCart", "getTotalCost"], {
      items$: of(mockCartItems)
    });

    notificationService = jasmine.createSpyObj("NotificationService", ["showSuccess", "showError", "showInfo"]);

    await TestBed.configureTestingModule({
      declarations: [CartPageComponent, SuccessComponent, OrderSummaryComponent],
      imports: [HttpClientTestingModule, FontAwesomeModule],
      providers: [{ provide: CartService, useValue: cartService }, { provide: NotificationService, useValue: notificationService }, provideRouter(routes)]
    }).compileComponents();

    fixture = TestBed.createComponent(CartPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with cart items", () => {
    const expectedCartItems = [{ product: { ...mockProducts, category: Category.CLOTHING }, quantity: 2 }];
    expect(component.cartItems).toEqual(expectedCartItems);
  });

  it("should increase quantity", () => {
    component.increaseQuantity("1");
    expect(cartService.updateQuantity).toHaveBeenCalledWith("1", 3);
  });

  it("should decrease quantity", () => {
    component.decreaseQuantity("1");
    expect(cartService.updateQuantity).toHaveBeenCalledWith("1", 1);
  });

  it("should remove item", () => {
    component.removeItem("1");
    expect(cartService.removeFromCart).toHaveBeenCalledWith("1");
  });

  it("should get correct quantity for product", () => {
    const quantity = component.getQuantity("1");
    expect(quantity).toBe(2);
  });

  it("should return 0 quantity for non-existent product", () => {
    const quantity = component.getQuantity("999");
    expect(quantity).toBe(0);
  });

  it("should calculate total cost", () => {
    cartService.getTotalCost.and.returnValue(200);
    const total = component.totalCost();
    expect(total).toBe(200);
  });

  it("should handle purchase", fakeAsync(() => {
    component.purchase();
    tick();

    expect(cartService.clearCart).toHaveBeenCalled();
    expect(router.url).toBe("/order-summary");
  }));
});
