import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
import { loadStripe } from "@stripe/stripe-js";

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  private stripe: any = null;

  constructor(private http: HttpClient) {
    this.initStripe();
  }

  private async initStripe() {
    this.stripe = await loadStripe("pk_test_51QIbSJEiHz0Qd84krtOOWXUeSOTGcyYtYln2jseDriIQcKGFLDMSU0PrNTYUzaygkG9bWb85qeBjCgAnLNjBVP6W000Awpy5fJ");
    console.log("PaymentService: Stripe initialized");
  }

  createCheckoutSession(amount: number): Observable<{ sessionId: string }> {
    console.log("PaymentService: Creating checkout session for amount:", amount);
    return this.http.post<{ sessionId: string }>(`${environment.host}/api/payment/create-checkout-session`, {
      amount: Math.round(amount * 100),
      currency: "usd",
      description: "PawnShop Purchase"
    });
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    console.log("PaymentService: Redirecting to checkout with sessionId:", sessionId);

    if (!this.stripe) {
      throw new Error("Stripe not initialized");
    }

    const { error } = await this.stripe.redirectToCheckout({
      sessionId: sessionId
    });

    if (error) {
      console.error("PaymentService: Redirect error:", error);
      throw new Error(error.message);
    }
  }
}
