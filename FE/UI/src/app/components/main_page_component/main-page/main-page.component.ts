// UI\src\app\components\main_page_component\main-page\main-page.component.ts

import { Component, OnInit } from "@angular/core";
import { Shoes } from "./Interfaces/Shoes";
import { SeedDataService } from "./seedData/seed-data.service";
import { Router } from "@angular/router";
import { CartService } from "../../../services/cart.service";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit {
  public shoes: Shoes[];
  public filteredShoes: Shoes[];
  public categories: string[] = ["Electronics", "Clothes", "Jewelry", "Collectables", "Art"];

  constructor(private seedDataService: SeedDataService, private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.shoes = this.seedDataService.shoes;
    this.filteredShoes = this.shoes;
  }

  goToDetails(id: number) {
    this.router.navigate(["/product", id]);
  }

  requestPurchase(shoe: Shoes) {
    this.cartService.addToCart(shoe);
  }
}
