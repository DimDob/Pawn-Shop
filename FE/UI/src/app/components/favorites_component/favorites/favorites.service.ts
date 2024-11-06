// UI/src/app/components/favorites_component/favorites/favorites.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap, catchError, of } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { environment } from "../../../../environments/environment";

interface FavoriteResponse {
  products: Products[];
}

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
      next: (response) => {
        console.log("FavoritesService: Raw response from server:", response);

        // Check if response is valid
        if (!response) {
          console.error("FavoritesService: Empty response from server");
          return;
        }

        // Convert response to array if it's not already
        const products = Array.isArray(response) ? response : [response];

        console.log("FavoritesService: Processed products:", products);
        this.favoritesSubject.next(products);
      },
      error: (error) => {
        console.error("FavoritesService: Error loading favorites", error);
        this.favoritesSubject.next([]);
      }
    });
  }

  addToFavorites(productId: string): Observable<any> {
    console.log("FavoritesService: Adding product to favorites", productId);
    return this.http.post(`${environment.host}/favorites/${productId}`, {}, { responseType: "text" }).pipe(
      tap((response) => {
        console.log("FavoritesService: Product added successfully", response);
        this.loadFavorites();
      }),
      catchError(error => {
        if (error.status === 200) {
          console.log("FavoritesService: Product added successfully (with empty response)");
          this.loadFavorites();
          return of(null);
        }
        console.error("FavoritesService: Error adding product", error);
        throw error;
      })
    );
  }

  removeFromFavorites(productId: string): Observable<any> {
    console.log("FavoritesService: Removing product from favorites", productId);
    return this.http.delete(`${environment.host}/favorites/${productId}`, { responseType: "text" }).pipe(
      tap(() => {
        console.log("FavoritesService: Product removed successfully");
        const currentFavorites = this.favoritesSubject.getValue();
        const updatedFavorites = currentFavorites.filter(p => p.id !== productId);
        this.favoritesSubject.next(updatedFavorites);
      }),
      catchError(error => {
        if (error.status === 200) {
          console.log("FavoritesService: Product removed successfully (with empty response)");
          const currentFavorites = this.favoritesSubject.getValue();
          const updatedFavorites = currentFavorites.filter(p => p.id !== productId);
          this.favoritesSubject.next(updatedFavorites);
          return of(null);
        }
        console.error("FavoritesService: Error removing product", error);
        throw error;
      })
    );
  }

  isProductFavorite(productId: string): boolean {
    return this.favoritesSubject.getValue().some(p => p.id === productId);
  }
}
