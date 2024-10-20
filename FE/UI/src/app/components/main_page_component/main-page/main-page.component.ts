// UI\src\app\components\main_page_component\main-page\main-page.component.ts

import { Component, OnInit } from "@angular/core";
import { Shoes } from "./Interfaces/Shoes";
import { SeedDataService } from "./seedData/seed-data.service";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit {
  public shoes: Shoes[];
  public filteredShoes: Shoes[]; // Добавено за филтриране
  public categories: string[] = ["Electronics", "Clothes", "Jewelry", "Collectables", "Art"]; // Добавени категории

  constructor(private seedDataService: SeedDataService) {}

  ngOnInit(): void {
    this.shoes = this.seedDataService.shoes;
    this.filteredShoes = this.shoes; // Инициализиране с всички продукти
    console.log(this.shoes);
  }

  requestPurchase() {
    // TODO check if product is available at the db
  }

  // Филтриране по категория
  filterByCategory(category: string) {
    if (category === "All") {
      this.filteredShoes = this.shoes;
    } else {
      this.filteredShoes = this.shoes.filter(shoe => shoe.category === category);
    }
  }
}
