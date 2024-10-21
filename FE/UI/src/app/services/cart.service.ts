// UI\src\app\services\cart.service.ts

import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Shoes } from "../components/main_page_component/main-page/Interfaces/Shoes";

@Injectable({
  providedIn: "root"
})
export class CartService {
  private itemsSubject = new BehaviorSubject<{ shoe: Shoes; quantity: number }[]>([]);
  items$ = this.itemsSubject.asObservable();

  constructor() {}

  addToCart(shoe: Shoes, quantity: number = 1) {
    const items = this.itemsSubject.getValue();
    const existingItem = items.find(item => item.shoe.id === shoe.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ shoe, quantity });
    }
    this.itemsSubject.next(items);
  }

  removeFromCart(shoeId: number) {
    let items = this.itemsSubject.getValue();
    items = items.filter(item => item.shoe.id !== shoeId);
    this.itemsSubject.next(items);
  }

  updateQuantity(shoeId: number, quantity: number) {
    const items = this.itemsSubject.getValue();
    const item = items.find(item => item.shoe.id === shoeId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(shoeId);
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
    return items.reduce((total, item) => total + item.shoe.price * item.quantity, 0);
  }
}
