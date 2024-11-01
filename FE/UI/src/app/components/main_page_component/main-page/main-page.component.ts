// UI\src\app\components\main_page_component\main-page\main-page.component.ts

import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
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

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit, OnDestroy {
  pageSize = Number(localStorage.getItem("preferredPageSize")) || 25;
  pageIndex = Number(localStorage.getItem("currentPageIndex")) || 0;
  totalProducts = 0;
  paginatedProducts: Products[] = [];

  public products: Products[] = [];
  public filteredProducts: Products[] = [];
  public categories = Object.values(Category);
  public selectedCategory: Category | "" = "";
  public searchTerm = "";

  public selectedSortOption = "";

  public isGridView = true;

  private subscriptions: Subscription = new Subscription();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productService: ProductService, private router: Router, private cartService: CartService, private searchService: SearchService) {}

  ngOnInit(): void {
    console.log("Инициализиране на компонента");

    const searchSub = this.searchService.searchTerm$.subscribe(term => {
      this.searchTerm = term.toLowerCase();
      if (this.products) {
        this.applyFilters();
      }
    });
    this.subscriptions.add(searchSub);

    const categorySub = this.searchService.selectedCategory$.subscribe(category => {
      this.selectedCategory = category as Category;
      if (this.products) {
        this.applyFilters();
      }
    });
    this.subscriptions.add(categorySub);

    const sortSub = this.searchService.sortOption$.subscribe(option => {
      this.selectedSortOption = option;
      if (this.products) {
        this.applyFilters();
      }
    });
    this.subscriptions.add(sortSub);

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log("Получени продукти от API:", products);
        if (products && products.length > 0) {
          console.log("Пример за цена на първия продукт:", products[0].price);
          this.products = products;
          this.filteredProducts = products;
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error("Грешка при зареждане на продукти:", error);
      }
    });

    this.pageSize = Number(localStorage.getItem("preferredPageSize")) || 25;
    this.pageIndex = Number(localStorage.getItem("currentPageIndex")) || 0;

    console.log("Заредени стойности от localStorage:", {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {
    console.log("Синхронизиране на paginator");
    if (this.paginator) {
      this.paginator.pageIndex = this.pageIndex;
      this.paginator.pageSize = this.pageSize;
    }
  }

  goToDetails(id: string) {
    this.router.navigate(["/product", id]);
  }

  requestPurchase(product: Products) {
    this.cartService.addToCart(product);
  }

  applyFilters() {
    if (!this.products) {
      console.log("No products to filter");
      return;
    }

    let filtered = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm) || product.model?.toLowerCase().includes(this.searchTerm) || product.category.toLowerCase().includes(this.searchTerm);
      const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
      return matchesSearch && matchesCategory;
    });

    if (this.selectedSortOption) {
      switch (this.selectedSortOption) {
        case "priceAsc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "priceDesc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "nameAsc":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "nameDesc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    this.filteredProducts = filtered;
    this.totalProducts = filtered.length;

    const maxValidPageIndex = Math.ceil(this.totalProducts / this.pageSize) - 1;
    if (this.pageIndex > maxValidPageIndex) {
      console.log("Коригиране на индекса на страницата поради филтриране");
      this.pageIndex = maxValidPageIndex >= 0 ? maxValidPageIndex : 0;
      localStorage.setItem("currentPageIndex", this.pageIndex.toString());

      if (this.paginator) {
        this.paginator.pageIndex = this.pageIndex;
      }
    }

    this.paginateProducts();
  }

  paginateProducts() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    console.log("Промяна на страница и размер", event);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    localStorage.setItem("preferredPageSize", event.pageSize.toString());
    localStorage.setItem("currentPageIndex", event.pageIndex.toString());

    this.paginateProducts();
  }

  toggleView() {
    console.log("Превключване на изглед");
    this.isGridView = !this.isGridView;
  }
}
