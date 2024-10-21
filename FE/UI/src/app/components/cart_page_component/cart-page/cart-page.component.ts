// UI\src\app\components\cart_page_component\cart-page\cart-page.component.ts

import { Component, OnInit } from "@angular/core";
import { CartService } from "../../../services/cart.service";
import { Shoes } from "../../main_page_component/main-page/Interfaces/Shoes";
import { Router } from "@angular/router";

@Component({
  selector: "app-cart-page",
  templateUrl: "./cart-page.component.html",
  styleUrls: ["./cart-page.component.scss"]
})
export class CartPageComponent implements OnInit {
  cartItems: { shoe: Shoes; quantity: number }[] = [];
  totalCost: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  increaseQuantity(shoeId: number) {
    this.cartService.updateQuantity(shoeId, this.getQuantity(shoeId) + 1);
  }

  decreaseQuantity(shoeId: number) {
    this.cartService.updateQuantity(shoeId, this.getQuantity(shoeId) - 1);
  }

  removeItem(shoeId: number) {
    this.cartService.removeFromCart(shoeId);
  }

  getQuantity(shoeId: number): number {
    const item = this.cartItems.find(item => item.shoe.id === shoeId);
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
