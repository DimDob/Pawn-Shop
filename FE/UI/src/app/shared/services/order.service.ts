import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class OrderService {
  private apiUrl = `${environment.host}/api/orders/create-summary`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: any) {
    console.log("OrderService: Creating order", orderData);
    return this.http.post<{ orderId: string }>(this.apiUrl, orderData);
  }
}
