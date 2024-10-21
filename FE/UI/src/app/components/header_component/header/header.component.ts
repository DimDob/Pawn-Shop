// UI\src\app\components\header_component\header\header.component.ts

import { Component } from "@angular/core";
import { CartService } from "../../../services/cart.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { SearchService } from "../../../services/search.service"; // Импортиране на SearchService

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  public categories: string[] = ["Electronics", "Clothes", "Jewelry", "Collectables", "Art"];
  public searchTerm: string = ""; // Добавено търсене

  cartItemCount: number = 0;
  isCartPage: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private searchService: SearchService // Инжектиране на SearchService
  ) {
    this.cartService.items$.subscribe(items => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      this.isCartPage = event.urlAfterRedirects === "/cart";
    });
  }

  onCategoryChange(category: string) {
    this.searchService.setSelectedCategory(category); // Използване на SearchService
  }

  onSearch() {
    this.searchService.setSearchTerm(this.searchTerm); // Използване на SearchService
  }
}
