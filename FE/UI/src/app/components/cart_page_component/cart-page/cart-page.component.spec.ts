// UI\src\app\components\cart_page_component\cart-page\cart-page.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { CartPageComponent } from "./cart-page.component";
import { CartService } from "./cart.service";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { provideRouter, Routes } from "@angular/router";
import { Component } from "@angular/core";

@Component({
  template: ""
})
class SuccessComponent {}

const routes: Routes = [{ path: "success", component: SuccessComponent }];

describe("CartPageComponent", () => {
  let component: CartPageComponent;
  let fixture: ComponentFixture<CartPageComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let router: Router;

  const mockProducts = {
    id: 1,
    picture: "test.jpg",
    color: "blue",
    size: 42,
    sex: "male" as const,
    manufacturer: "Nike",
    model: "Air Max",
    name: "Test Shoe",
    category: "Shoes",
    price: 100
  };

  const mockCartItems = [{ product: mockProducts, quantity: 2 }];

  beforeEach(async () => {
    cartService = jasmine.createSpyObj("CartService", ["updateQuantity", "removeFromCart", "clearCart", "getTotalCost"], {
      items$: of(mockCartItems)
    });

    await TestBed.configureTestingModule({
      declarations: [CartPageComponent, SuccessComponent],
      providers: [{ provide: CartService, useValue: cartService }, provideRouter(routes)]
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
    expect(component.cartItems).toEqual(mockCartItems);
  });

  it("should increase quantity", () => {
    component.increaseQuantity(1);
    expect(cartService.updateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it("should decrease quantity", () => {
    component.decreaseQuantity(1);
    expect(cartService.updateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it("should remove item", () => {
    component.removeItem(1);
    expect(cartService.removeFromCart).toHaveBeenCalledWith(1);
  });

  it("should get correct quantity for product", () => {
    const quantity = component.getQuantity(1);
    expect(quantity).toBe(2);
  });

  it("should return 0 quantity for non-existent product", () => {
    const quantity = component.getQuantity(999);
    expect(quantity).toBe(0);
  });

  it("should calculate total cost", () => {
    cartService.getTotalCost.and.returnValue(200);
    component.calculateTotal();
    expect(component.totalCost).toBe(200);
  });

  it("should handle purchase", fakeAsync(() => {
    component.purchase();
    tick();

    expect(cartService.clearCart).toHaveBeenCalled();
    expect(router.url).toBe("/success");
  }));
});
