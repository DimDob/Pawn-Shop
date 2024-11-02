// UI\src\app\components\my-products\my-products.component.ts
import { Component, OnInit, signal } from "@angular/core";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-my-products",
  templateUrl: "./my-products.component.html",
  styleUrls: ["./my-products.component.scss"]
})
export class MyProductsComponent implements OnInit {
  protected products = signal<Products[]>([]);

  constructor(private seedDataService: SeedDataService, private router: Router) {}

  ngOnInit(): void {
    try {
      this.products.set(this.seedDataService.products);
    } catch (error) {
      alert("Failed to load products. Please try again later.");
    }
  }

  protected goToDetails(id: string): void {
    this.router.navigate(["/product", id]);
  }
}
