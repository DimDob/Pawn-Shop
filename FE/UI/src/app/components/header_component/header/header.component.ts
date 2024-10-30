// UI\src\app\components\header_component\header\header.component.ts
import { Component, ViewEncapsulation } from "@angular/core";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { SearchService } from "../../../shared/services/search.service";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { AuthService } from "../../../app.service";
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

  constructor(private cartService: CartService, private router: Router, private searchService: SearchService, private authService: AuthService) {
    this.cartService.items$.subscribe(items => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      this.isCartPage = event.urlAfterRedirects === "/cart";
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

  // Добавени методи за навигация към Add Product и My Products
}
