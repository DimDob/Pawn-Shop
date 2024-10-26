// UI\src\app\components\details_page_component\details-page\details-page.component.ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";

@Component({
  selector: "app-details-page",
  templateUrl: "./details-page.component.html",
  styleUrls: ["./details-page.component.scss"]
})
export class DetailsPageComponent implements OnInit {
  product: Products | undefined;
  quantity: number = 1;

  constructor(private route: ActivatedRoute, private seedDataService: SeedDataService, private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      // Check if id exists
      const id = +idParam;
      this.product = this.seedDataService.products.find(product => product.id === id);
      if (!this.product) {
        // Check if product is found
        console.error(`Product with id ${id} not found.`);
        this.router.navigate(["/not-found"]); // Redirect to not found page
      }
    } else {
      console.error("No id parameter provided.");
      this.router.navigate(["/not-found"]); // Redirect to not found page
    }
  }

  addToCart() {
    if (this.product) {
      // Check if product exists
      this.cartService.addToCart(this.product, this.quantity);
    } else {
      console.error("Cannot add product to cart because product is not available.");
    }
  }
}
