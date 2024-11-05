// UI\src\app\components\details_page_component\details-page\details-page.component.ts
import { Component, signal, computed, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { AuthService } from "../../../app.service";
import { FavoritesService } from "../../favorites_component/favorites/favorites.service";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-details-page",
  templateUrl: "./details-page.component.html",
  styleUrls: ["./details-page.component.scss"]
})
export class DetailsPageComponent {
  // Dependencies
  private route = inject(ActivatedRoute);
  private seedDataService = inject(SeedDataService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  private notificationService = inject(NotificationService);

  // Signals
  product = signal<Products | undefined>(undefined);
  quantity = signal(1);
  showConfirmModal = signal(false);

  // Computed values
  isOwner = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    return Boolean(currentUser.id && this.product()?.ownerId === currentUser.id);
  });

  isFavorite = computed(() => (this.product() ? this.favoritesService.isProductFavorite(this.product()!.id) : false));

  constructor() {
    this.initializeProduct();
  }

  private initializeProduct(): void {
    const idParam = this.route.snapshot.paramMap.get("id");

    if (!idParam) {
      this.router.navigate(["/not-found"]);
      return;
    }

    const foundProduct = this.seedDataService.products.find(product => product.id === idParam);

    if (!foundProduct) {
      this.router.navigate(["/not-found"]);
      return;
    }

    this.product.set(foundProduct);
  }

  onAddToCart(): void {
    if (this.product()) {
      this.cartService.addToCart(this.product()!, this.quantity());
    }
  }

  onEditProduct(): void {
    if (this.product()) {
      this.router.navigate(["/edit-product", this.product()!.id]);
    }
  }

  onConfirmDelete(): void {
    this.showConfirmModal.set(true);
  }

  onDeleteProduct(): void {
    if (!this.product()) return;

    try {
      this.seedDataService.products = this.seedDataService.products.filter(p => p.id !== this.product()?.id);

      this.showConfirmModal.set(false);
      this.notificationService.showSuccess("Product deleted successfully");
      this.router.navigate(["/pawn-shop/main-page"]);
    } catch (error) {
      this.notificationService.showError("An error occurred while deleting the product.");
    }
  }

  onCancelDelete(): void {
    this.showConfirmModal.set(false);
  }

  onToggleFavorite(): void {
    if (!this.product()) return;

    if (this.isFavorite()) {
      this.favoritesService.removeFromFavorites(this.product()!.id);
    } else {
      this.favoritesService.addToFavorites(this.product()!);
    }
  }
}
