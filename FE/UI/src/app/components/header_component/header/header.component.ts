import { Component, EventEmitter, Output } from "@angular/core";
import { CartService } from "../../../services/cart.service";
import { Router, NavigationEnd, Event } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  public categories: string[] = ["Electronics", "Clothes", "Jewelry", "Collectables", "Art"];

  @Output() categorySelected = new EventEmitter<string>();

  cartItemCount: number = 0;
  isCartPage: boolean = false;

  constructor(private cartService: CartService, private router: Router) {
    this.cartService.items$.subscribe(items => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(event => {
      this.isCartPage = event.urlAfterRedirects === "/cart";
    });
  }

  onCategoryChange(category: string) {
    this.categorySelected.emit(category);
  }
}
