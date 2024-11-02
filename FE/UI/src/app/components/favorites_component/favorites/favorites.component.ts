import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FavoritesService } from "./favorites.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";

@Component({
  selector: "app-favorites",
  templateUrl: "./favorites.component.html",
  styleUrls: ["./favorites.component.scss"]
})
export class FavoritesComponent implements OnInit {
  favoriteProducts: Products[] = [];

  constructor(private favoritesService: FavoritesService, private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.favoritesService.favorites$.subscribe(products => {
      this.favoriteProducts = products;
    });
  }

  addToCart(product: Products) {
    this.cartService.addToCart(product);
  }

  removeFromFavorites(productId: string) {
    this.favoritesService.removeFromFavorites(productId);
  }

  goToDetails(productId: string) {
    this.router.navigate(["/product", productId]);
  }
}
