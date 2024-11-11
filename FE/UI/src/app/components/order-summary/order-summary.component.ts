import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CartService } from "../cart_page_component/cart-page/cart.service";
import { PaymentService } from "../../shared/services/payment.service";
import { NotificationService } from "../../shared/services/notification.service";
import { ShippingDetails } from "./interfaces/shipping-details.interface";
import { OrderService } from "../../shared/services/order.service";

@Component({
  selector: "app-order-summary",
  templateUrl: "./order-summary.component.html",
  styleUrls: ["./order-summary.component.scss"]
})
export class OrderSummaryComponent implements OnInit {
  cartItems: any[] = [];
  isProcessing = false;
  estimatedDeliveryStart: Date;
  estimatedDeliveryEnd: Date;

  shippingDetails: ShippingDetails = {
    buyerName: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: ""
  };

  constructor(private cartService: CartService, private paymentService: PaymentService, private notificationService: NotificationService, private router: Router, private orderService: OrderService) {
    console.log("OrderSummaryComponent: Initialized");

    // Calculate estimated delivery dates (7-14 days from now)
    this.estimatedDeliveryStart = new Date();
    this.estimatedDeliveryStart.setDate(this.estimatedDeliveryStart.getDate() + 7);

    this.estimatedDeliveryEnd = new Date();
    this.estimatedDeliveryEnd.setDate(this.estimatedDeliveryEnd.getDate() + 14);
  }

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      console.log("OrderSummaryComponent: Cart items updated", items);
      this.cartItems = items;
    });
  }

  totalCost(): number {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  async placeOrder(): Promise<void> {
    console.log("OrderSummaryComponent: Starting order process");

    if (this.isProcessing || !this.validateForm()) {
      return;
    }

    this.isProcessing = true;

    try {
      // First create order
      const orderResponse = await this.orderService
        .createOrder({
          shippingDetails: this.shippingDetails,
          items: this.cartItems,
          total: this.totalCost(),
          estimatedDeliveryStart: this.estimatedDeliveryStart,
          estimatedDeliveryEnd: this.estimatedDeliveryEnd
        })
        .toPromise();

      if (!orderResponse?.orderId) {
        throw new Error("Failed to create order");
      }

      // Then create Stripe session with order ID
      const amount = this.totalCost();
      const response = await this.paymentService.createCheckoutSession(amount, orderResponse.orderId).toPromise();

      if (!response?.sessionId) {
        throw new Error("No session ID received");
      }

      console.log("OrderSummaryComponent: Got session ID, redirecting to Stripe");
      // await this.paymentService.redirectToCheckout(response.sessionId);
    } catch (error: any) {
      console.error("OrderSummaryComponent: Error:", error);
      this.notificationService.showError(error.message || "Failed to process order");
    } finally {
      this.isProcessing = false;
    }
  }

  validateForm(): boolean {
    // Implement your form validation logic here
    return true;
  }
}
