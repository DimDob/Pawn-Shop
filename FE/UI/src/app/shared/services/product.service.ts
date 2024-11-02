// UI\src\app\services\product.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, map, catchError, throwError } from "rxjs";
import { Products } from "../../components/main_page_component/main-page/Interfaces/Products";
import { environment } from "../../../environments/environment";
import { Category } from "../../components/main_page_component/main-page/enums/Category";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  private host = `${environment.host}/data/expose/products`;

  constructor(private http: HttpClient) {}

  public getAllProducts(): Observable<Products[]> {
    return this.http.get<Products[]>(this.host).pipe(
      map(products => {
        return products.map(product => {
          try {
            return {
              ...product,
              price: parseFloat(product.price?.toString() || "0"),
              category: product.category?.toUpperCase() as Category
            };
          } catch (error) {
            console.error(`Error processing product ${product.id}:`, error);
            throw error;
          }
        });
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("Error fetching products:", error);
        return throwError(() => error);
      })
    );
  }
}
