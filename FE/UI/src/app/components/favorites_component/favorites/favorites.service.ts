import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";

@Injectable({
  providedIn: "root"
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Products[]>([]);
  favorites$ = this.favoritesSubject.asObservable();
  private readonly STORAGE_KEY = "favorites";

  constructor() {
    console.log("FavoritesService: Initialized");
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      console.log("FavoritesService: Loading from localStorage");
      this.favoritesSubject.next(JSON.parse(stored));
    }
  }

  private saveToLocalStorage(favorites: Products[]) {
    console.log("FavoritesService: Saving to localStorage");
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  }

  addToFavorites(product: Products) {
    const currentFavorites = this.favoritesSubject.getValue();
    if (!currentFavorites.find(p => p.id === product.id)) {
      console.log("FavoritesService: Adding product to favorites", product);
      const newFavorites = [...currentFavorites, product];
      this.favoritesSubject.next(newFavorites);
      this.saveToLocalStorage(newFavorites);
    }
  }

  removeFromFavorites(productId: string) {
    const currentFavorites = this.favoritesSubject.getValue();
    console.log("FavoritesService: Removing product from favorites", productId);
    const newFavorites = currentFavorites.filter(p => p.id !== productId);
    this.favoritesSubject.next(newFavorites);
    this.saveToLocalStorage(newFavorites);
  }

  isProductFavorite(productId: string): boolean {
    return this.favoritesSubject.getValue().some(p => p.id === productId);
  }
}
