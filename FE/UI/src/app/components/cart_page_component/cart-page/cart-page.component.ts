// UI\src\app\components\cart_page_component\cart-page\cart-page.component.ts

import { Component, OnInit } from "@angular/core";
import { CartService } from "./cart.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Router } from "@angular/router";
import { signal, computed } from "@angular/core";
import {
  faShoppingCart,
  faPlus,
  faMinus,
  faTrash,
  faCheck,
  faCartPlus,
  faShop
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-cart-page",
  templateUrl: "./cart-page.component.html",
  styleUrls: ["./cart-page.component.scss"]
})
export class CartPageComponent implements OnInit {
  cartItems = signal<{ product: Products; quantity: number }[]>([]);
  totalCost = computed(() =>
    this.cartItems().reduce((total, item) =>
      total + item.product.price * item.quantity, 0
    )
  );

  // Font Awesome icons
  faShoppingCart = faShoppingCart;
  faPlus = faPlus;
  faMinus = faMinus;
  faTrash = faTrash;
  faCheck = faCheck;
  faCartPlus = faCartPlus;
  faShop = faShop;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("CartPageComponent: Initializing");
    this.cartService.items$.subscribe(items => {
      console.log("CartPageComponent: Updating cart items");
      this.cartItems.set(items);
    });
  }

  increaseQuantity(productId: string): void {
    console.log("CartPageComponent: Increasing quantity for product", productId);
    const currentQuantity = this.getQuantity(productId);
    this.cartService.updateQuantity(productId, currentQuantity + 1);
  }

  decreaseQuantity(productId: string): void {
    console.log("CartPageComponent: Decreasing quantity for product", productId);
    const currentQuantity = this.getQuantity(productId);
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(productId, currentQuantity - 1);
    }
  }

  removeItem(productId: string): void {
    console.log("CartPageComponent: Removing product", productId);
    this.cartService.removeFromCart(productId);
  }

  getQuantity(productId: string): number {
    const item = this.cartItems().find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  purchase(): void {
    console.log("CartPageComponent: Processing purchase");
    this.cartService.clearCart();
    this.router.navigate(["/success"]);
  }
}
