// UI\src\app\components\header_component\header\header.component.ts

import { Component } from "@angular/core";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { SearchService } from "../../../shared-services/search.service"; // Импортиране на SearchService

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  public categories: string[] = ["Electronics", "Clothes", "Jewelry", "Art", "Other"];
  public searchTerm: string = "";

  cartItemCount: number = 0;
  isCartPage: boolean = false;

  constructor(private cartService: CartService, private router: Router, private searchService: SearchService) {
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
}
