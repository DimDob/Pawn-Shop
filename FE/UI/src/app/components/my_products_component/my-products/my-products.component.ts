// UI\src\app\components\my-products\my-products.component.ts
import { Component, OnInit, OnDestroy, ViewChild, signal } from "@angular/core";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Router } from "@angular/router";
import { ProductService } from "../../../shared/services/product.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { faBoxArchive, faBox, faPlus } from "@fortawesome/free-solid-svg-icons";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { Category } from "../../main_page_component/main-page/enums/Category";

@Component({
  selector: "app-my-products",
  templateUrl: "./my-products.component.html",
  styleUrls: ["./my-products.component.scss"]
})
export class MyProductsComponent implements OnInit {
  faBoxArchive = faBoxArchive;
  faBox = faBox;
  faPlus = faPlus;

  protected pageSize = signal<number>(Number(localStorage.getItem("myProductsPageSize")) || 25);
  protected pageIndex = signal<number>(Number(localStorage.getItem("myProductsPageIndex")) || 0);
  protected totalProducts = signal<number>(0);
  protected paginatedProducts = signal<Products[]>([]);
  protected products = signal<Products[]>([]);
  protected isGridView = signal<boolean>(true);
  protected searchTerm = signal<string>("");
  protected selectedSortOption = signal<string>("");
  protected selectedCategory = signal<string>("");
  protected categories = Object.values(Category);
  protected originalProducts = signal<Products[]>([]);

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  constructor(private productService: ProductService, private router: Router, private notificationService: NotificationService) {}

  ngOnInit(): void {
    console.log("MyProductsComponent: Loading products");
    this.loadMyProducts();
  }

  private loadMyProducts(): void {
    this.productService.getMyProducts().subscribe({
      next: products => {
        console.log("MyProductsComponent: Products loaded successfully", products);
        this.originalProducts.set(products);
        this.products.set(products);
        this.totalProducts.set(products.length);
        this.applyFilters();
      },
      error: error => {
        console.error("MyProductsComponent: Error loading products", error);
        this.notificationService.showError("Failed to load products. Please try again later.");
      }
    });
  }

  protected paginateProducts(): void {
    console.log("Paginating products");
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    this.paginatedProducts.set(this.products().slice(startIndex, endIndex));
  }

  protected onPageChange(event: PageEvent): void {
    console.log("Page changed", event);
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    localStorage.setItem("myProductsPageSize", event.pageSize.toString());
    localStorage.setItem("myProductsPageIndex", event.pageIndex.toString());

    this.paginateProducts();
  }

  protected goToDetails(id: string): void {
    console.log("MyProductsComponent: Navigating to product details", id);
    this.router.navigate(["/product", id]);
  }

  protected toggleView(): void {
    console.log("Toggling view");
    this.isGridView.update(value => !value);
  }

  protected onSearchChange(term: string): void {
    console.log("Search term changed:", term);
    this.searchTerm.set(term);
    this.applyFilters();
  }

  protected onSortChange(option: string): void {
    console.log("Sort option changed:", option);
    this.selectedSortOption.set(option);
    this.applyFilters();
  }

  protected onCategoryChange(category: string): void {
    console.log("Category changed:", category);
    this.selectedCategory.set(category);
    this.applyFilters();
  }

  private applyFilters(): void {
    console.log("Applying filters");
    let filteredProducts = [...this.originalProducts()];

    // Apply search filter
    if (this.searchTerm()) {
      const searchTerm = this.searchTerm().toLowerCase();
      filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(searchTerm) || product.manufacturer?.toLowerCase().includes(searchTerm) || product.model?.toLowerCase().includes(searchTerm));
    }

    // Apply category filter
    if (this.selectedCategory()) {
      filteredProducts = filteredProducts.filter(product => product.category === this.selectedCategory());
    }

    this.products.set(filteredProducts);
    this.totalProducts.set(filteredProducts.length);
    this.paginateProducts();
  }

  navigateToAddProduct() {
    this.router.navigate(["/add-product"]);
  }
}
