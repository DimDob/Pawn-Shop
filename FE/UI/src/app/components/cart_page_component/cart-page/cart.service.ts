// UI\src\app\components\cart_page_component\cart-page\cart.service.ts
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, of } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { StorageKeys } from "../../../enums/StorageKeys";

@Injectable({
  providedIn: "root"
})
export class CartService {
  private itemsSubject = new BehaviorSubject<{ product: Products; quantity: number }[]>([]);
  public items$ = this.itemsSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  private validateJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) && parsed.every(item => item?.product?.id && typeof item.quantity === "number" && item.quantity >= 0);
    } catch {
      console.error("Invalid cart data format detected");
      return false;
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(StorageKeys.CART);
      if (stored && this.validateJSON(stored)) {
        this.itemsSubject.next(JSON.parse(stored));
      }
    } catch (error) {
      alert("Error loading cart data: " + error);
    }
  }

  private saveToLocalStorage(items: { product: Products; quantity: number }[]): void {
    try {
      const jsonString = JSON.stringify(items);
      if (this.validateJSON(jsonString)) {
        localStorage.setItem(StorageKeys.CART, jsonString);
      }
    } catch (error) {
      alert("Error saving cart data: " + error);
    }
  }

  public addToCart(product: Products, quantity = 1): void {
    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    const items = this.itemsSubject.getValue();
    const existingItemIndex = items.findIndex(item => (item?.product?.id ? item.product.id === product.id : null));

    if (existingItemIndex > -1) {
      const newItems = [...items];
      newItems[existingItemIndex] = {
        ...items[existingItemIndex],
        quantity: items[existingItemIndex].quantity + quantity
      };
      this.itemsSubject.next(newItems);
    } else {
      this.itemsSubject.next([...items, { product, quantity }]);
    }

    this.saveToLocalStorage(this.itemsSubject.getValue());
  }

  public removeFromCart(productId: string): void {
    const newItems = this.itemsSubject.getValue().filter(item => (item?.product?.id ? item.product.id !== productId : null));
    this.itemsSubject.next(newItems);
    this.saveToLocalStorage(newItems);
  }

  public updateQuantity(productId: string, quantity: number): void {
    if (quantity < 0) {
      console.warn("Quantity cannot be negative");
      return;
    }

    const items = this.itemsSubject.getValue();
    const itemIndex = items.findIndex(item => (item?.product?.id ? item.product.id === productId : null));

    if (itemIndex > -1) {
      if (quantity === 0) {
        this.removeFromCart(productId);
      } else {
        const newItems = [...items];
        newItems[itemIndex] = { ...items[itemIndex], quantity };
        this.itemsSubject.next(newItems);
        this.saveToLocalStorage(newItems);
      }
    }
  }

  public clearCart(): void {
    this.itemsSubject.next([]);
    localStorage.removeItem(StorageKeys.CART);
  }

  public getTotalCost(): number {
    return this.itemsSubject.getValue().reduce((total, item) => total + (item?.product?.price || 0) * (item?.quantity || 0), 0);
  }
}
