// UI\src\app\components\cart_page_component\cart-page\cart-page.component.ts

import { Component, OnInit } from "@angular/core";
import { CartService } from "./cart.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Router } from "@angular/router";

@Component({
  selector: "app-cart-page",
  templateUrl: "./cart-page.component.html",
  styleUrls: ["./cart-page.component.scss"]
})
export class CartPageComponent implements OnInit {
  cartItems: { product: Products; quantity: number }[] = [];
  totalCost: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  increaseQuantity(productId: number) {
    this.cartService.updateQuantity(productId, this.getQuantity(productId) + 1);
  }

  decreaseQuantity(productId: number) {
    this.cartService.updateQuantity(productId, this.getQuantity(productId) - 1);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  getQuantity(productId: number): number {
    const item = this.cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  calculateTotal() {
    this.totalCost = this.cartService.getTotalCost();
  }

  purchase() {
    this.cartService.clearCart();
    this.router.navigate(["/success"]);
  }
}
