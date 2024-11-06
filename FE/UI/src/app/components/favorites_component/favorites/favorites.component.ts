// UI/src/app/components/favorites_component/favorites/favorites.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FavoritesService } from "./favorites.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { NotificationService } from "../../../shared/services/notification.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-favorites",
  templateUrl: "./favorites.component.html",
  styleUrls: ["./favorites.component.scss"]
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteProducts: Products[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    console.log("FavoritesComponent: Initializing");
    this.subscription.add(
      this.favoritesService.favorites$.subscribe({
        next: (products) => {
          console.log("FavoritesComponent: Received products:", products);
          if (products && Array.isArray(products)) {
            console.log("FavoritesComponent: Setting products, count:", products.length);
            this.favoriteProducts = products;
          } else {
            console.error("FavoritesComponent: Invalid products data:", products);
            this.favoriteProducts = [];
          }
        },
        error: (error) => {
          console.error("FavoritesComponent: Error in subscription:", error);
          this.favoriteProducts = [];
          this.notificationService.showError("Failed to load favorite products");
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeFromFavorites(productId: string) {
    console.log("FavoritesComponent: Removing product from favorites", productId);
    this.favoritesService.removeFromFavorites(productId).subscribe({
      next: () => {
        console.log("FavoritesComponent: Product removed successfully");
        this.notificationService.showSuccess("Product removed from favorites");
      },
      error: (error) => {
        if (error.status === 200) {
          console.log("FavoritesComponent: Product removed successfully (with parsing error)");
          this.notificationService.showSuccess("Product removed from favorites");
        } else {
          console.error("FavoritesComponent: Error removing product", error);
          this.notificationService.showError("Failed to remove product from favorites");
        }
      }
    });
  }

  addToCart(product: Products) {
    console.log("FavoritesComponent: Adding product to cart", product);
    this.cartService.addToCart(product);
    this.notificationService.showSuccess("Product added to cart");
  }

  goToDetails(productId: string) {
    console.log("FavoritesComponent: Navigating to product details", productId);
    this.router.navigate(["/product", productId]);
  }
}
