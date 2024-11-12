// UI\src\app\components\my-products\my-products.component.ts
import { Component, OnInit, signal } from "@angular/core";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Router } from "@angular/router";
import { ProductService } from "../../../shared/services/product.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-my-products",
  templateUrl: "./my-products.component.html",
  styleUrls: ["./my-products.component.scss"]
})
export class MyProductsComponent implements OnInit {
  faBoxOpen = faBoxOpen;
  protected products = signal<Products[]>([]);

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
      },
      error: (error) => {
        console.error("MyProductsComponent: Error loading products", error);
        this.notificationService.showError("Failed to load products. Please try again later.");
      }
    });
  }

  protected goToDetails(id: string): void {
    console.log("MyProductsComponent: Navigating to product details", id);
    this.router.navigate(["/product", id]);
  }
}
