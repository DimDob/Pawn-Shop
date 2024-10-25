// UI\src\app\services\cart.service.ts

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";

@Injectable({
  providedIn: "root"
})
export class CartService {
  private itemsSubject = new BehaviorSubject<{ product: Products; quantity: number }[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() {}

  addToCart(product: Products, quantity: number = 1) {
    const items = this.itemsSubject.getValue();
    const existingItem = items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.itemsSubject.next(items);
  }

  removeFromCart(productId: number) {
    let items = this.itemsSubject.getValue();
    items = items.filter(item => item.product.id !== productId);
    this.itemsSubject.next(items);
  }

  updateQuantity(productId: number, quantity: number) {
    const items = this.itemsSubject.getValue();
    const item = items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.itemsSubject.next(items);
      }
    }
  }

  clearCart() {
    this.itemsSubject.next([]);
  }

  getTotalCost(): number {
    const items = this.itemsSubject.getValue();
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}
