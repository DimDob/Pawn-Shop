// UI\src\app\components\details_page_component\details-page\details-page.component.ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { CartService } from "../../../services/cart.service";

@Component({
  selector: "app-details-page",
  templateUrl: "./details-page.component.html",
  styleUrls: ["./details-page.component.scss"]
})
export class DetailsPageComponent implements OnInit {
  product: Products;
  quantity: number = 1;

  constructor(private route: ActivatedRoute, private seedDataService: SeedDataService, private cartService: CartService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get("id")!; //?
    this.product = this.seedDataService.products.find(product => product.id === id)!; //?
  }

  addToCart() {
    this.cartService.addToCart(this.product, this.quantity);
  }
}
