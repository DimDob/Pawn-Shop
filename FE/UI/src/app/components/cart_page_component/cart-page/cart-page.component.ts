// UI\src\app\components\cart_page_component\cart-page\cart-page.component.ts

import { Component, OnInit } from "@angular/core";
import { CartService } from "./cart.service";
import { FavoritesService } from "../../favorites_component/favorites/favorites.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Router } from "@angular/router";
import { signal, computed } from "@angular/core";
import { NotificationService } from "../../../shared/services/notification.service";
import { faShoppingCart, faPlus, faMinus, faTrash, faCheck, faCartPlus, faShop, faHeart } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-cart-page",
  templateUrl: "./cart-page.component.html",
  styleUrls: ["./cart-page.component.scss"]
})
export class CartPageComponent implements OnInit {
  cartItems = signal<{ product: Products; quantity: number }[]>([]);
  totalCost = computed(() => this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0));

  // Font Awesome icons
  faShoppingCart = faShoppingCart;
  faPlus = faPlus;
  faMinus = faMinus;
  faTrash = faTrash;
  faCheck = faCheck;
  faCartPlus = faCartPlus;
  faShop = faShop;
  faHeart = faHeart;

  constructor(private cartService: CartService, public favoritesService: FavoritesService, private notificationService: NotificationService, private router: Router) {}

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

  addToFavorites(product: Products): void {
    console.log("CartPageComponent: Adding to favorites:", product);

    // Първо проверяваме дали продуктът вече е в любими
    if (this.favoritesService.isProductFavorite(product.id)) {
      console.log("CartPageComponent: Product already in favorites");
      this.notificationService.showInfo("Product is already in favorites");
      return;
    }

    this.favoritesService.addToFavorites(product.id).subscribe({
      next: () => {
        console.log("CartPageComponent: Product added to favorites successfully");
        this.notificationService.showSuccess("Product added to favorites");
      },
      error: error => {
        console.error("CartPageComponent: Error adding to favorites:", error);
        if (error.status === 200) {
          // Ако получим 200, но продуктът вече е в любими
          this.notificationService.showInfo("Product is already in favorites");
        } else {
          this.notificationService.showError("Failed to add product to favorites");
        }
      }
    });
  }
}
