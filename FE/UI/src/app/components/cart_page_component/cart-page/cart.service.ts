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
  private readonly STORAGE_KEY = "cart";

  constructor() {
    console.log("CartService: Initialized");
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      console.log("CartService: Loading from localStorage");
      this.itemsSubject.next(JSON.parse(stored));
    }
  }

  private saveToLocalStorage(items: { product: Products; quantity: number }[]) {
    console.log("CartService: Saving to localStorage");
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  addToCart(product: Products, quantity: number = 1) {
    const items = this.itemsSubject.getValue();
    const existingItem = items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.itemsSubject.next(items);
    this.saveToLocalStorage(items);
  }

  removeFromCart(productId: string) {
    let items = this.itemsSubject.getValue();
    items = items.filter(item => item.product.id !== productId);
    this.itemsSubject.next(items);
    this.saveToLocalStorage(items);
  }

  updateQuantity(productId: string, quantity: number) {
    const items = this.itemsSubject.getValue();
    const item = items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.itemsSubject.next(items);
        this.saveToLocalStorage(items);
      }
    }
  }

  clearCart() {
    console.log("CartService: Clearing cart");
    this.itemsSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getTotalCost(): number {
    const items = this.itemsSubject.getValue();
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}
