import { Component, OnInit } from "@angular/core";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-my-products",
  templateUrl: "./my-products.component.html",
  styleUrls: ["./my-products.component.scss"]
})
export class MyProductsComponent implements OnInit {
  products: Products[] = [];

  constructor(private seedDataService: SeedDataService, private router: Router) {}

  ngOnInit(): void {
    // Получаваме продуктите (тук можете да получите продуктите на текущия потребител)
    this.products = this.seedDataService.products;
  }

  goToDetails(id: string) {
    this.router.navigate(["/product", id]);
  }
}
