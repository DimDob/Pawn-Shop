// UI/src/app/components/admin/admin.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getAllOrders() {
    console.log("Fetching all orders");
    return this.http.get(`${environment.host}/api/orders/admin/all`);
  }
}
