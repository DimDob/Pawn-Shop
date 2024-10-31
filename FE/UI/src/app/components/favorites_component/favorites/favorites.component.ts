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

  constructor(private favoritesService: FavoritesService, private cartService: CartService, private router: Router) {
    console.log("FavoritesComponent: Initializing");
  }

  ngOnInit() {
    this.favoritesService.favorites$.subscribe(products => {
      console.log("FavoritesComponent:  Updating favorites", products);
      this.favoriteProducts = products;
    });
  }

  addToCart(product: Products) {
    console.log("FavoritesComponent: Adding to cart", product);
    this.cartService.addToCart(product);
  }

  removeFromFavorites(productId: string) {
    console.log("FavoritesComponent: Removing from favorites", productId);
    this.favoritesService.removeFromFavorites(productId);
  }

  goToDetails(productId: string) {
    console.log("FavoritesComponent: Navigating to details", productId);
    this.router.navigate(["/product", productId]);
  }
}
