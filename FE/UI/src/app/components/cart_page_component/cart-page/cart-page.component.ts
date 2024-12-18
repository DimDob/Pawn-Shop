// UI\src\app\components\cart_page_component\cart-page\cart-page.component.ts

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CartService } from "./cart.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { FavoritesService } from "../../favorites_component/favorites/favorites.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { faShoppingCart, faTrash, faCartPlus, faShop, faCreditCard, faHeart, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

interface CartItem {
  product: Products;
  quantity: number;
}

@Component({
  selector: "app-cart-page",
  templateUrl: "./cart-page.component.html",
  styleUrls: ["./cart-page.component.scss"]
})
export class CartPageComponent implements OnInit {
  cartItems: CartItem[] = [];
  // Font Awesome icons
  faShoppingCart = faShoppingCart;
  faTrash = faTrash;
  faCartPlus = faCartPlus;
  faShop = faShop;
  faCreditCard = faCreditCard;
  faHeart = faHeart;
  faPlus = faPlus;
  faMinus = faMinus;

  isProcessing = false;

  constructor(private cartService: CartService, private notificationService: NotificationService, private router: Router, public favoritesService: FavoritesService) {
    console.log("CartPageComponent: Initialized");
  }

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      console.log("CartPageComponent: Cart items updated", items);
      this.cartItems = items;
    });
  }

  totalCost(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  removeItem(productId: string): void {
    console.log("CartPageComponent: Removing item from cart:", productId);
    this.cartService.removeFromCart(productId);
    this.notificationService.showSuccess("Item removed from cart");
  }

  increaseQuantity(productId: string): void {
    console.log("CartPageComponent: Increasing quantity for:", productId);
    const item = this.cartItems.find(i => i.product.id.toString() === productId);
    if (item) {
      this.cartService.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: string): void {
    console.log("CartPageComponent: Decreasing quantity for:", productId);
    const item = this.cartItems.find(i => i.product.id.toString() === productId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(productId, item.quantity - 1);
    }
  }

  addToFavorites(product: Products): void {
    console.log("CartPageComponent: Adding to favorites:", product);

    // First check if the product is already in favorites
    if (this.favoritesService.isProductFavorite(product.id)) {
      console.log("CartPageComponent: Product already in favorites");
      this.notificationService.showInfo("Product is already in favorites");
      return;
    }

    this.favoritesService.addToFavorites(product.id).subscribe({
      next: response => {
        console.log("CartPageComponent: Product added to favorites successfully", response);
        this.notificationService.showSuccess("Product added to favorites");
      },
      error: error => {
        console.error("CartPageComponent: Error adding to favorites:", error);
        if (error.status === 200) {
          this.notificationService.showSuccess("Product added to favorites");
        } else {
          this.notificationService.showError("Failed to add product to favorites");
        }
      }
    });
  }

  purchase(): void {
    console.log("CartPageComponent: Navigating to order summary");
    this.router.navigate(["/order-summary"]);
  }

  getQuantity(productId: string): number {
    console.log("Getting quantity for product ID:", productId);
    const item = this.cartItems.find(item => item.product.id === productId);
    const quantity = item ? item.quantity : 0;
    console.log("Quantity found:", quantity);
    return quantity;
  }
}
