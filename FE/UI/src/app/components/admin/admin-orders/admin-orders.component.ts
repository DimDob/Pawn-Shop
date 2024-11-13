// UI/src/app/components/admin/admin-orders/admin-orders.component.ts
import { Component, OnInit, signal } from "@angular/core";
import { AdminService } from "./../admin.service";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-admin-orders",
  templateUrl: "./admin-orders.component.html",
  styleUrls: ["./admin-orders.component.scss"]
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<any[]>([]);
  faListAlt = faListAlt;
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    this.adminService.getAllOrders().subscribe({
      next: response => {
        console.log("Orders loaded successfully");
        this.orders.set(response as any[]);
      },
      error: error => {
        console.error("Error loading orders:", error);
      }
    });
  }
}
