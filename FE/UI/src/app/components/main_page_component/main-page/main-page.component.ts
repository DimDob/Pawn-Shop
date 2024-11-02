// UI\src\app\components\main_page_component\main-page\main-page.component.ts
import { Component, OnInit, OnDestroy, ViewChild, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Products } from "./Interfaces/Products";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { SearchService } from "../../../shared/services/search.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { Category } from "./enums/Category";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { ProductService } from "../../../shared/services/product.service";
import { ErrorHandlerService } from "../../../shared/services/error-handler.service";
import { catchError } from "rxjs";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit, OnDestroy {
  public pageSize = signal<number>(Number(localStorage.getItem("preferredPageSize")) || 25);
  private pageIndex = signal<number>(Number(localStorage.getItem("currentPageIndex")) || 0);
  protected totalProducts = signal<number>(0);
  protected paginatedProducts = signal<Products[]>([]);

  protected products = signal<Products[]>([]);
  protected filteredProducts = signal<Products[]>([]);
  protected categories = Object.values(Category);
  protected selectedCategory = signal<string>("");
  protected searchTerm = signal<string>("");

  protected selectedSortOption = signal<string>("");
  protected isGridView = signal<boolean>(true);

  private subscriptions: Subscription = new Subscription();

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  constructor(private productService: ProductService, private router: Router, private cartService: CartService, private searchService: SearchService, private errorHandler: ErrorHandlerService) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
    this.loadProducts();
    this.loadStoredPreferences();
  }

  private initializeSubscriptions(): void {
    const searchSub = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm.set(term.toLowerCase());
      if (this.products()) {
        this.applyFilters();
      }
    });

    const categorySub = this.searchService.selectedCategory$.subscribe(category => {
      this.selectedCategory.set(category as Category);
      if (this.products()) {
        this.applyFilters();
      }
    });

    const sortSub = this.searchService.sortOption$.subscribe(option => {
      this.selectedSortOption.set(option);
      if (this.products()) {
        this.applyFilters();
      }
    });

    this.subscriptions.add(searchSub);
    this.subscriptions.add(categorySub);
    this.subscriptions.add(sortSub);
  }

  private loadProducts(): void {
    this.productService
      .getAllProducts()
      .pipe(
        catchError(error => {
          alert("Failed to load products. Please try again later.");
          return this.errorHandler.handleError(error);
        })
      )
      .subscribe({
        next: products => {
          if (products?.length > 0) {
            this.products.set(products);
            this.filteredProducts.set(products);
            this.applyFilters();
          }
        },
        error: () => {
          alert("Error occurred while processing products. Please refresh the page.");
        }
      });
  }

  private loadStoredPreferences(): void {
    const storedPageSize = Number(localStorage.getItem("preferredPageSize"));
    const storedPageIndex = Number(localStorage.getItem("currentPageIndex"));

    if (storedPageSize) this.pageSize.set(storedPageSize);
    if (storedPageIndex) this.pageIndex.set(storedPageIndex);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.pageIndex = this.pageIndex();
      this.paginator.pageSize = this.pageSize();
    }
  }

  protected goToDetails(id: string): void {
    this.router.navigate(["/product", id]);
  }

  protected requestPurchase(product: Products): void {
    this.cartService.addToCart(product);
  }

  protected applyFilters(): void {
    if (!this.products()) {
      alert("No products available to filter");
      return;
    }

    let filtered = this.products().filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm()) || product.model?.toLowerCase().includes(this.searchTerm()) || product.category?.toLowerCase().includes(this.searchTerm());

      const matchesCategory = !this.selectedCategory() || product.category?.toLowerCase() === this.selectedCategory().toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (this.selectedSortOption()) {
      filtered = this.sortProducts(filtered);
    }

    this.filteredProducts.set(filtered);
    this.totalProducts.set(filtered.length);

    this.adjustPageIndexIfNeeded();
    this.paginateProducts();
  }

  private sortProducts(products: Products[]): Products[] {
    const sorted = [...products];
    switch (this.selectedSortOption()) {
      case "priceAsc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "nameAsc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }
    return sorted;
  }

  private adjustPageIndexIfNeeded(): void {
    const maxValidPageIndex = Math.ceil(this.totalProducts() / this.pageSize()) - 1;
    if (this.pageIndex() > maxValidPageIndex) {
      const newPageIndex = maxValidPageIndex >= 0 ? maxValidPageIndex : 0;
      this.pageIndex.set(newPageIndex);
      localStorage.setItem("currentPageIndex", newPageIndex.toString());

      if (this.paginator) {
        this.paginator.pageIndex = newPageIndex;
      }
    }
  }

  protected paginateProducts(): void {
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    this.paginatedProducts.set(this.filteredProducts().slice(startIndex, endIndex));
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    localStorage.setItem("preferredPageSize", event.pageSize.toString());
    localStorage.setItem("currentPageIndex", event.pageIndex.toString());

    this.paginateProducts();
  }

  protected toggleView(): void {
    this.isGridView.update(value => !value);
  }
  protected setSelectedCategory(value: string) {
    this.selectedCategory.set(value);
    this.applyFilters();
  }
}
