// UI\src\app\components\details_page_component\details-page\details-page.component.ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { AuthService } from "../../../app.service";
import { FavoritesService } from "../../../services/favorites.service";
@Component({
  selector: "app-details-page",
  templateUrl: "./details-page.component.html",
  styleUrls: ["./details-page.component.scss"]
})
export class DetailsPageComponent implements OnInit {
  product: Products | undefined;
  quantity = 1;
  isOwner = false;
  showConfirmModal = false;
  isFavorite = false;
  constructor(private route: ActivatedRoute, private seedDataService: SeedDataService, private cartService: CartService, private router: Router, private authService: AuthService, private favoritesService: FavoritesService) {
    console.log("DetailsPageComponent: Инициализиране");
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      const id = idParam;
      this.product = this.seedDataService.products.find(product => product.id === id);
      if (!this.product) {
        console.error(`Product with id ${id} not found.`);
        this.router.navigate(["/not-found"]);
      } else {
        this.isOwner = this.product.ownerId === this.authService.getCurrentUser().id;
        this.isFavorite = this.favoritesService.isProductFavorite(this.product.id);
      }
    } else {
      console.error("No id parameter provided.");
      this.router.navigate(["/not-found"]);
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
    } else {
      console.error("Cannot add product to cart because product is not available.");
    }
  }

  editProduct() {
    if (this.product) {
      this.router.navigate(["/edit-product", this.product.id]);
    }
  }

  confirmDelete() {
    this.showConfirmModal = true;
  }

  deleteProduct() {
    if (this.product) {
      this.seedDataService.products = this.seedDataService.products.filter(p => p.id !== this.product?.id);
      this.showConfirmModal = false;
      this.router.navigate(["/pawn-shop/main-page"]);
    }
  }

  cancelDelete() {
    this.showConfirmModal = false;
  }

  toggleFavorite() {
    if (this.product) {
      if (this.isFavorite) {
        console.log("DetailsPageComponent: Премахване от любими");
        this.favoritesService.removeFromFavorites(this.product.id);
      } else {
        console.log("DetailsPageComponent: Добавяне към любими");
        this.favoritesService.addToFavorites(this.product);
      }
      this.isFavorite = !this.isFavorite;
    }
  }
}
