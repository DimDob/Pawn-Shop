// UI\src\app\components\details_page_component\details-page\details-page.component.ts
import { Component, signal, computed, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { AuthService } from "../../../app.service";
import { FavoritesService } from "../../favorites_component/favorites/favorites.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { ProductService } from "../../../shared/services/product.service";

@Component({
  selector: "app-details-page",
  templateUrl: "./details-page.component.html",
  styleUrls: ["./details-page.component.scss"]
})
export class DetailsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);
  private notificationService = inject(NotificationService);

  product = signal<Products | null>(null);
  quantity = signal<number>(1);
  showConfirmModal = signal<boolean>(false);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  isProcessing = signal<boolean>(false);

  productData = computed(() => this.product());

  isOwner = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    const product = this.product();

    console.log("DetailsPageComponent: Checking ownership");
    console.log("Current user:", currentUser);
    console.log("Product owner ID:", product?.ownerId);

    const isOwner = Boolean(currentUser?.id && product?.ownerId === currentUser.id);
    console.log("Is owner:", isOwner);

    return isOwner;
  });

  isFavorite = computed(() => (this.product() ? this.favoritesService.isProductFavorite(this.product()!.id) : false));

  canEditDelete = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    const product = this.product();

    console.log("DetailsPageComponent: Checking edit/delete permissions");
    console.log("Current user:", currentUser);
    console.log("Is admin?", currentUser?.isAdmin);
    console.log("Is owner?", this.isOwner());

    return Boolean(currentUser?.isAdmin || this.isOwner());
  });

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get("id");
    if (!productId) {
      this.error.set("Product ID not found");
      this.product.set(null); // Задаване на null при липсващ ID
      this.router.navigate(["/not-found"]);
      return;
    }

    this.loading.set(true);
    this.productService.getProductById(productId).subscribe({
      next: product => {
        console.log("DetailsPageComponent: Product loaded:", product);
        console.log("DetailsPageComponent: Product owner ID:", product.ownerId);
        this.product.set(product);
        this.loading.set(false);
      },
      error: error => {
        console.error("DetailsPageComponent: Error loading product:", error);
        this.error.set("Error loading product");
        this.product.set(null); // Задаване на null при грешка
        this.loading.set(false);
        this.notificationService.showError("Error loading product details");
        this.router.navigate(["/not-found"]);
      }
    });
  }

  onAddToCart(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.addToCart(currentProduct, this.quantity());
      this.notificationService.showSuccess("Product added to cart");
    }
  }

  onEditProduct(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.router.navigate(["/pawn-shop/edit-product", currentProduct.id]);
    }
  }

  onConfirmDelete(): void {
    this.showConfirmModal.set(true);
  }

  onDeleteProduct(): void {
    const productId = this.product()?.id;
    if (!productId) return;

    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        console.log("DetailsPageComponent: Product deleted successfully");
        this.showConfirmModal.set(false);
        this.notificationService.showSuccess("Product deleted successfully");
        this.router.navigate(["/pawn-shop/main-page"]);
      },
      error: error => {
        console.error("DetailsPageComponent: Error deleting product:", error);
        this.notificationService.showError("Error deleting product");
        this.showConfirmModal.set(false);
      }
    });
  }

  onCancelDelete(): void {
    this.showConfirmModal.set(false);
  }

  onToggleFavorite(): void {
    if (this.isProcessing()) return;

    const currentProduct = this.product();
    if (!currentProduct) return;

    this.isProcessing.set(true);
    console.log("DetailsPageComponent: Toggling favorite status");

    const action = this.isFavorite()
      ? this.favoritesService.removeFromFavorites(currentProduct.id)
      : this.favoritesService.addToFavorites(currentProduct.id);

    action.subscribe({
      next: () => {
        const message = this.isFavorite()
          ? "Removed from favorites"
          : "Added to favorites";
        this.notificationService.showSuccess(message);
        this.product.set({ ...currentProduct });
      },
      error: (error) => {
        if (error.status === 200) {
          const message = this.isFavorite()
            ? "Removed from favorites"
            : "Added to favorites";
          this.notificationService.showSuccess(message);
          this.product.set({ ...currentProduct });
        } else {
          console.error("DetailsPageComponent: Error toggling favorites", error);
          this.notificationService.showError("Failed to update favorites");
        }
      },
      complete: () => {
        this.isProcessing.set(false);
      }
    });
  }

  incrementQuantity(): void {
    const currentProduct = this.product();
    if (currentProduct && this.quantity() < (currentProduct.quantityInStock || 0)) {
      this.quantity.set(this.quantity() + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  updateQuantity(value: number): void {
    const currentProduct = this.product();
    if (currentProduct) {
      const newQuantity = Math.min(
        Math.max(1, value),
        currentProduct.quantityInStock || 0
      );
      this.quantity.set(newQuantity);
    }
  }
}
