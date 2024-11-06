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

  ngOnInit(): void {
    this.loadProduct();
  }

  private loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get("id");
    if (!productId) {
      this.error.set("Product ID not found");
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
    const currentProduct = this.product();
    if (!currentProduct) return;

    console.log("DetailsPageComponent: Toggling favorite status");
    console.log("Current favorite status:", this.isFavorite());

    if (this.isFavorite()) {
      this.favoritesService.removeFromFavorites(currentProduct.id).subscribe({
        next: () => {
          console.log("DetailsPageComponent: Product removed from favorites");
          this.product.set({ ...currentProduct });
          this.notificationService.showSuccess("Removed from favorites");
        },
        error: (error) => {
          if (error.status === 200) {
            console.log("DetailsPageComponent: Product removed successfully (with parsing error)");
            this.product.set({ ...currentProduct });
            this.notificationService.showSuccess("Removed from favorites");
          } else {
            console.error("DetailsPageComponent: Error removing from favorites", error);
            this.notificationService.showError("Failed to remove from favorites");
          }
        }
      });
    } else {
      this.favoritesService.addToFavorites(currentProduct.id).subscribe({
        next: () => {
          console.log("DetailsPageComponent: Product added to favorites");
          this.product.set({ ...currentProduct });
          this.notificationService.showSuccess("Added to favorites");
        },
        error: (error) => {
          if (error.status === 200) {
            console.log("DetailsPageComponent: Product added successfully (with parsing error)");
            this.product.set({ ...currentProduct });
            this.notificationService.showSuccess("Added to favorites");
          } else {
            console.error("DetailsPageComponent: Error adding to favorites", error);
            this.notificationService.showError("Failed to add to favorites");
          }
        }
      });
    }
  }
}
