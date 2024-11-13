// UI/src/app/shared/services/order.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class OrderService {
  private apiUrl = `${environment.host}/api/orders`;

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<any> {
    console.log("OrderService: Creating order", orderData);
    return this.http.post(`${this.apiUrl}/create`, orderData);
  }
}
