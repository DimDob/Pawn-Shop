// UI/src/app/components/favorites_component/favorites/favorites.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Products[]>([]);
  favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log("FavoritesService: Initializing");
    this.loadFavorites();
  }

  private loadFavorites() {
    console.log("FavoritesService: Loading favorites from server");
    this.http.get<Products[]>(`${environment.host}/favorites`).subscribe({
      next: (products) => {
        console.log("FavoritesService: Raw response from server:", products);
        if (Array.isArray(products)) {
          console.log("FavoritesService: Favorites loaded successfully. Count:", products.length);
          this.favoritesSubject.next(products);
        } else {
          console.error("FavoritesService: Server response is not an array:", products);
          this.favoritesSubject.next([]);
        }
      },
      error: (error) => {
        console.error("FavoritesService: Error loading favorites", error);
        this.favoritesSubject.next([]);
      }
    });
  }

  addToFavorites(productId: string): Observable<any> {
    console.log("FavoritesService: Adding product to favorites", productId);
    return this.http.post(`${environment.host}/favorites/${productId}`, {}).pipe(tap(() => this.loadFavorites()));
  }

  removeFromFavorites(productId: string): Observable<any> {
    console.log("FavoritesService: Removing product from favorites", productId);
    return this.http.delete(`${environment.host}/favorites/${productId}`).pipe(tap(() => this.loadFavorites()));
  }

  isProductFavorite(productId: string): boolean {
    return this.favoritesSubject.getValue().some(p => p.id === productId);
  }
}
