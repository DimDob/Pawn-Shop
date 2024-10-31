// UI\src\app\components\header_component\header\header.component.ts
import { Component, ViewEncapsulation } from "@angular/core";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { SearchService } from "../../../shared/services/search.service";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { AuthService } from "../../../app.service";
import { FavoritesService } from "../../favorites_component/favorites/favorites.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  public categories = Object.values(Category);
  public searchTerm = "";

  public cartItemCount = 0;
  isCartPage = false;

  public favoritesCount = 0;
  isFavoritesPage = false;

  constructor(private cartService: CartService, private router: Router, private searchService: SearchService, private authService: AuthService, private favoritesService: FavoritesService) {
    this.cartService.items$.subscribe(items => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    this.favoritesService.favorites$.subscribe(favorites => {
      console.log("HeaderComponent: Updating favorites count");
      this.favoritesCount = favorites.length;
    });

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      this.isCartPage = event.urlAfterRedirects === "/cart";
      this.isFavoritesPage = event.urlAfterRedirects === "/favorites";
    });
  }

  onCategoryChange(category: string) {
    this.searchService.setSelectedCategory(category);
  }

  onSearch() {
    this.searchService.setSearchTerm(this.searchTerm);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }

  // Added methods for navigation to Add Product and My Products
}
