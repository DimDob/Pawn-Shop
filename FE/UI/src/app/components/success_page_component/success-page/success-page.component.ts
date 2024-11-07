// UI\src\app\components\success_page_component\success-page\success-page.component.ts

import { Component, OnInit } from "@angular/core";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-success-page",
  templateUrl: "./success-page.component.html",
  styleUrls: ["./success-page.component.scss"]
})
export class SuccessPageComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {
    console.log("SuccessPageComponent: Initialized");
  }

  ngOnInit() {
    console.log("SuccessPageComponent: Clearing cart after successful payment");
    this.cartService.clearCart();
    this.notificationService.showSuccess("Payment completed successfully!");
  }
}
