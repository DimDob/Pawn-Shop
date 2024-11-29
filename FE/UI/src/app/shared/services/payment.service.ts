// UI/src/app/shared/services/payment.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { loadStripe } from "@stripe/stripe-js";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  private apiUrl = `${environment.host}/api/payment`;
  private stripePromise = loadStripe(environment.stripe.publishableKey);

  constructor(private http: HttpClient, private router: Router) {}

  createCheckoutSession(amount: number, orderId: string) {
    // Convert amount to cents/стотинки for Stripe
    const amountInCents = Math.round(amount * 100);
    console.log("PaymentService: Creating checkout session", { amountInCents, orderId });

    return this.http.post<{ sessionId: string }>(`${this.apiUrl}/create-checkout-session`, {
      amount: amountInCents,
      currency: "bgn",
      orderId
    });
  }

  async redirectToCheckout(sessionId: string) {
    console.log("PaymentService: Redirecting to checkout");
    const stripe = await this.stripePromise;
    const result = await stripe?.redirectToCheckout({ sessionId });

    if (result?.error) {
      console.error("PaymentService: Error redirecting to checkout:", result.error);
    }
  }

  confirmPayment(orderId: string) {
    console.log("PaymentService: Confirming payment for order:", orderId);
    return this.http.post(`${this.apiUrl}/confirm-payment/${orderId}`, {});
  }
}
