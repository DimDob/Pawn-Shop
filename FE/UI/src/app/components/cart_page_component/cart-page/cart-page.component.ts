// UI\src\app\components\cart_page_component\cart-page\cart-page.component.ts

import { Component, OnInit } from "@angular/core";
import { CartService } from "./cart.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { PaymentService } from "../../../shared/services/payment.service";
import { FavoritesService } from "../../favorites_component/favorites/favorites.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { BehaviorSubject } from "rxjs";
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

  constructor(private cartService: CartService, private paymentService: PaymentService, private notificationService: NotificationService, public favoritesService: FavoritesService) {
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
    this.favoritesService.addToFavorites(product.id.toString());
  }

  async purchase(): Promise<void> {
    console.log("CartPageComponent: Starting purchase process");

    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const amount = this.totalCost();

      if (amount <= 0) {
        throw new Error("Invalid cart amount");
      }

      this.notificationService.showInfo("Processing payment...");

      const response = await this.paymentService.createCheckoutSession(amount).toPromise();

      if (!response?.sessionId) {
        throw new Error("No session ID received");
      }

      console.log("CartPageComponent: Got session ID, redirecting to Stripe");
      await this.paymentService.redirectToCheckout(response.sessionId);
    } catch (error: any) {
      console.error("CartPageComponent: Payment error:", error);
      this.notificationService.showError(error.message || "Payment failed. Please try again.");
    } finally {
      this.isProcessing = false;
    }
  }
}
