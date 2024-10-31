import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";

@Injectable({
  providedIn: "root"
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Products[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor() {
    console.log("FavoritesService: Initialized");
  }

  addToFavorites(product: Products) {
    const currentFavorites = this.favoritesSubject.getValue();
    if (!currentFavorites.find(p => p.id === product.id)) {
      console.log("FavoritesService: Adding product to favorites", product);
      this.favoritesSubject.next([...currentFavorites, product]);
    }
  }

  removeFromFavorites(productId: string) {
    const currentFavorites = this.favoritesSubject.getValue();
    console.log("FavoritesService: Removing product from favorites", productId);
    this.favoritesSubject.next(currentFavorites.filter(p => p.id !== productId));
  }

  isProductFavorite(productId: string): boolean {
    return this.favoritesSubject.getValue().some(p => p.id === productId);
  }
}
