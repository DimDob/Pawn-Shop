// UI\src\app\components\my-products\my-products.component.ts
import { Component, OnInit, OnDestroy, ViewChild, signal } from "@angular/core";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Router } from "@angular/router";
import { ProductService } from "../../../shared/services/product.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import { PageEvent, MatPaginator } from "@angular/material/paginator";

@Component({
  selector: "app-my-products",
  templateUrl: "./my-products.component.html",
  styleUrls: ["./my-products.component.scss"]
})
export class MyProductsComponent implements OnInit {
  faBoxArchive = faBoxArchive;

  // Добавяне на сигнали за пагинация
  protected pageSize = signal<number>(Number(localStorage.getItem("myProductsPageSize")) || 25);
  protected pageIndex = signal<number>(Number(localStorage.getItem("myProductsPageIndex")) || 0);
  protected totalProducts = signal<number>(0);
  protected paginatedProducts = signal<Products[]>([]);
  protected products = signal<Products[]>([]);
  protected isGridView = signal<boolean>(true);

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  constructor(
    private productService: ProductService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    console.log("MyProductsComponent: Loading products");
    this.loadMyProducts();
  }

  private loadMyProducts(): void {
    this.productService.getMyProducts().subscribe({
      next: (products) => {
        console.log("MyProductsComponent: Products loaded successfully", products);
        this.products.set(products);
        this.totalProducts.set(products.length);
        this.paginateProducts();
      },
      error: (error) => {
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
}
