import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { loadStripe } from "@stripe/stripe-js";

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  private apiUrl = `${environment.host}/api/payment`;
  private stripePromise = loadStripe(environment.stripe.publishableKey);

  constructor(private http: HttpClient) {}

  createCheckoutSession(amount: number, orderId: string) {
    console.log("PaymentService: Creating checkout session", { amount, orderId });
    return this.http.post<{ sessionId: string }>(`${this.apiUrl}/create-checkout-session`, {
      amount,
      currency: "eur",
      orderId
    });
  }

  async redirectToCheckout(sessionId: string) {
    const stripe = await this.stripePromise;
    return stripe?.redirectToCheckout({ sessionId });
  }
}
