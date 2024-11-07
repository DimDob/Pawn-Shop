// UI\src\app\components\header_component\header\header.component.ts
import { Component, ViewEncapsulation, input, output, signal, SimpleChanges, OnChanges } from "@angular/core";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { SearchService } from "../../../shared/services/search.service";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { AuthService } from "../../../app.service";
import { FavoritesService } from "../../favorites_component/favorites/favorites.service";
import { computed } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnChanges {
  // Constants
  private readonly INITIAL_COUNT = 0;
  private readonly INITIAL_SEARCH_TERM = "";

  // Inputs and Outputs
  categories = input<Category[]>();
  categoryChanged = output<string>();

  // Signals
  searchTerm = signal(this.INITIAL_SEARCH_TERM);
  cartItemCount = signal(this.INITIAL_COUNT);
  favoritesCount = signal(this.INITIAL_COUNT);
  currentCategory = signal<string>("");

  // Computed values
  isCartPage = signal(false);
  isFavoritesPage = signal(false);

  constructor(private cartService: CartService, private router: Router, private searchService: SearchService, private authService: AuthService, private favoritesService: FavoritesService) {
    this.initializeSubscriptions();
    this.initializeRouteListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["currentCategory"]) {
      const category = this.currentCategory();
      if (category !== undefined) {
        this.categoryChanged.emit(category);
        this.searchService.setSelectedCategory(category);
        alert(`Category changed to: ${category || "All"}`);
      }
    }
  }

  private initializeSubscriptions(): void {
    // Cart items subscription
    this.cartService.items$.subscribe(items => {
      this.cartItemCount.set(items.reduce((count, item) => count + item.quantity, this.INITIAL_COUNT));
    });

    // Favorites subscription
    this.favoritesService.favorites$.subscribe(favorites => {
      this.favoritesCount.set(favorites.length);
    });
  }

  private initializeRouteListener(): void {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      this.isCartPage.set(event.urlAfterRedirects === "/cart");
      this.isFavoritesPage.set(event.urlAfterRedirects === "/favorites");
    });
  }

  onCategoryChange(category: string): void {
    console.log("Category changed to:", category);
    this.currentCategory.set(category);
    this.categoryChanged.emit(category);
    this.searchService.setSelectedCategory(category);
  }

  onSearch(): void {
    this.searchService.setSearchTerm(this.searchTerm());
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(["/auth/login"]);
  }

  onResetAndNavigateHome(): void {
    this.searchTerm.set(this.INITIAL_SEARCH_TERM);
    this.currentCategory.set("");
    this.searchService.setSearchTerm(this.INITIAL_SEARCH_TERM);
    this.searchService.setSelectedCategory("");
    this.searchService.setSortOption("");

    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate(["/pawn-shop/main-page"]);
    });
  }
}
