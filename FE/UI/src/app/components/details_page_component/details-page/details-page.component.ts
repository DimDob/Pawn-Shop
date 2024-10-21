// UI\src\app\components\details_page_component\details-page\details-page.component.ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Shoes } from "../../main_page_component/main-page/Interfaces/Shoes";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { CartService } from "../../../services/cart.service";

@Component({
  selector: "app-details-page",
  templateUrl: "./details-page.component.html",
  styleUrls: ["./details-page.component.scss"]
})
export class DetailsPageComponent implements OnInit {
  shoe: Shoes;
  quantity: number = 1;

  constructor(private route: ActivatedRoute, private seedDataService: SeedDataService, private cartService: CartService) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get("id")!; //?
    this.shoe = this.seedDataService.shoes.find(shoe => shoe.id === id)!; //?
  }

  addToCart() {
    this.cartService.addToCart(this.shoe, this.quantity);
  }
}
