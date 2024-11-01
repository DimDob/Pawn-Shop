import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Products } from "../../components/main_page_component/main-page/Interfaces/Products";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  private host = `${environment.host}/data/expose/products`;

  constructor(private http: HttpClient) {
    console.log("ProductService: Инициализация");
  }

  getAllProducts(): Observable<Products[]> {
    console.log("ProductService: Извличане на всички продукти");
    return this.http.get<Products[]>(this.host).pipe(
      map(products => {
        console.log("ProductService: Получени необработени данни:", products);
        return products.map(product => {
          console.log("Processing product price:", product.price);
          return {
            ...product,
            price: parseFloat(product.price?.toString() || "0")
          };
        });
      })
    );
  }
}
