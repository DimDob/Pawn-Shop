import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  private apiUrl = `${environment.host}/api/payment`;

  constructor(private http: HttpClient) {}

  createCheckoutSession(amount: number, orderId: string) {
    console.log("PaymentService: Creating checkout session", { amount, orderId });
    return this.http.post<{sessionId: string}>(`${this.apiUrl}/create-checkout-session`, {
      amount,
      currency: "eur",
      orderId
    });
  }
}
