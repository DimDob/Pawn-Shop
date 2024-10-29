// UI\src\app\components\cart_page_component\cart-page\cart-page.component.ts

import { Component, OnInit } from "@angular/core";
import { CartService } from "./cart.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Router } from "@angular/router";
import { signal, computed } from "@angular/core";

@Component({
  selector: "app-cart-page",
  templateUrl: "./cart-page.component.html",
  styleUrls: ["./cart-page.component.scss"]
})
export class CartPageComponent implements OnInit {
  cartItems = signal<{ product: Products; quantity: number }[]>([]);

  totalCost = computed(() => this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0));

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe({
      next: items => {
        this.cartItems.set(items);
      },
      error: error => {
        console.error("Failed to load cart items", error);
      }
    });
  }

  increaseQuantity = (productId: number) => {
    const currentQuantity = this.getQuantity(productId);
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  };

  decreaseQuantity = (productId: number) => {
    const currentQuantity = this.getQuantity(productId);
    this.cartService.updateQuantity(productId, currentQuantity - 1);
  };

  removeItem = (productId: number) => {
    this.cartService.removeFromCart(productId);
  };

  getQuantity = (productId: number): number => {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  purchase = () => {
    this.cartService.clearCart();
    this.router.navigate(["/success"]);
  };
}
