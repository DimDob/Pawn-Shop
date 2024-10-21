// UI\src\app\components\main_page_component\main-page\main-page.component.ts

import { Component, OnInit } from "@angular/core";
import { Products } from "./Interfaces/Products";
import { SeedDataService } from "./seedData/seed-data.service";
import { Router } from "@angular/router";
import { CartService } from "../../../services/cart.service";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit {
  public products: Products[];
  public filteredProducts: Products[];
  public categories: string[] = ["Electronics", "Clothes", "Jewelry", "Collectables", "Art"];

  constructor(private seedDataService: SeedDataService, private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.products = this.seedDataService.products;
    this.filteredProducts = this.products;
  }

  goToDetails(id: number) {
    this.router.navigate(["/product", id]);
  }

  requestPurchase(product: Products) {
    this.cartService.addToCart(product);
  }
}
