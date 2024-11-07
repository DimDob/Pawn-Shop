// UI/src/app/components/favorites_component/favorites/favorites.component.ts
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FavoritesService } from "./favorites.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { NotificationService } from "../../../shared/services/notification.service";
import { Subscription } from "rxjs";
import {
  faHeart,
  faCartPlus,
  faTrash,
  faInfoCircle,
  faShop,
  faHeartBroken
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-favorites",
  templateUrl: "./favorites.component.html",
  styleUrls: ["./favorites.component.scss"]
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favoriteProducts: Products[] = [];
  private subscription: Subscription = new Subscription();

  // Font Awesome icons
  faHeart = faHeart;
  faCartPlus = faCartPlus;
  faTrash = faTrash;
  faInfoCircle = faInfoCircle;
  faShop = faShop;
  faHeartBroken = faHeartBroken;

  constructor(
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    console.log("FavoritesComponent: Initializing");
    this.loadFavorites();
  }

  private loadFavorites() {
    this.subscription.add(
      this.favoritesService.favorites$.subscribe({
        next: (products) => {
          console.log("FavoritesComponent: Received products:", products);
          this.favoriteProducts = products;
        },
        error: (error) => {
          console.error("FavoritesComponent: Error loading favorites:", error);
          this.notificationService.showError("Failed to load favorite products");
        }
      })
    );
  }

  getTotalValue(): number {
    return this.favoriteProducts.reduce((total, product) => total + product.price, 0);
  }

  addToCart(product: Products) {
    console.log("FavoritesComponent: Adding to cart:", product);
    this.cartService.addToCart(product);
    this.notificationService.showSuccess("Product added to cart");
  }

  removeFromFavorites(productId: string) {
    console.log("FavoritesComponent: Removing from favorites:", productId);
    this.favoritesService.removeFromFavorites(productId).subscribe({
      next: () => {
        console.log("FavoritesComponent: Product removed successfully");
        this.notificationService.showSuccess("Product removed from favorites");
      },
      error: (error) => {
        console.error("FavoritesComponent: Error removing product:", error);
        this.notificationService.showError("Failed to remove product");
      }
    });
  }

  goToDetails(productId: string) {
    console.log("FavoritesComponent: Navigating to details:", productId);
    this.router.navigate(["/product", productId]);
  }

  ngOnDestroy() {
    console.log("FavoritesComponent: Destroying");
    this.subscription.unsubscribe();
  }
}
