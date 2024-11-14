// UI/src/app/components/admin/admin-orders/admin-orders.component.ts
import { Component, OnInit, signal } from "@angular/core";
import { AdminService } from "./admin.service";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: "app-admin-orders",
  templateUrl: "./admin-orders.component.html",
  styleUrls: ["./admin-orders.component.scss"]
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<any[]>([]);
  faListAlt = faListAlt;
  protected pageSize = signal<number>(25);
  protected pageIndex = signal<number>(0);
  protected totalOrders = signal<number>(0);
  protected paginatedOrders = signal<any[]>([]);

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadOrders();
  }

  private loadOrders() {
    this.adminService.getAllOrders().subscribe({
      next: response => {
        console.log("Orders loaded successfully", response);
        const ordersArray = response as any[];
        this.orders.set(ordersArray);
        this.totalOrders.set(ordersArray.length);
        this.paginateOrders();
      },
      error: error => {
        console.error("Error loading orders:", error);
      }
    });
  }

  protected paginateOrders(): void {
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    this.paginatedOrders.set(this.orders().slice(startIndex, endIndex));
  }

  protected onPageChange(event: PageEvent): void {
    console.log("Page changed:", event);
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.paginateOrders();
  }
}
