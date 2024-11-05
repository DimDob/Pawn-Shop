// UI\src\app\services\product.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Products } from "../../components/main_page_component/main-page/Interfaces/Products";
import { ProductType } from "../interfaces/product-type.interface";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../app.service";
import { catchError, switchMap } from "rxjs/operators";

interface ProductTypeResponse {
  id: string;
  name: string;
  productName: string;
}

@Injectable({
  providedIn: "root"
})
export class ProductService {
  private baseUrl = environment.host;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProductTypes(): Observable<ProductTypeResponse[]> {
    console.log("ProductService: Fetching product types");
    return this.http.get<ProductTypeResponse[]>(`${this.baseUrl}/data/expose/product-types`);
  }

  addProduct(productData: FormData): Observable<Products> {
    console.log("ProductService: Sending product data to backend");

    if (!this.authService.getToken()) {
      console.error("ProductService: No valid token found");
      return throwError(() => new Error("No valid token"));
    }

    const jsonData = {
      name: productData.get("name") as string,
      manufacturer: productData.get("manufacturer") as string,
      model: productData.get("model") as string,
      price: Number(productData.get("price")),
      pawnPercentage: 0.5,
      secondHandPrice: Number(productData.get("price")) * 0.8,
      picture: productData.get("picture") as string || "base64encodedimagestringorURL",
      category: productData.get("category") as string,
      condition: "New",
      color: productData.get("color") as string,
      size: Number(productData.get("size")),
      sex: productData.get("sex") as string || "Unisex",
      quantityInStock: 10,
      isRunOutOfStock: false,
      productTypeId: "b54b1080-4f76-4cb4-ab68-aea44616122f" // Default Electronics ID
    };

    return this.http
      .post<Products>(`${this.baseUrl}/product-add`, jsonData, {
        headers: this.authService.getAuthHeaders()
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("ProductService: Error adding product:", error);
          if (error.status === 403) {
            this.authService.logout();
          }
          return throwError(() => error);
        })
      );
  }

  updateProduct(id: string, productData: FormData): Observable<Products> {
    console.log("ProductService: Updating product data");
    const headers = this.authService.getAuthHeaders();
    headers.delete("Content-Type");

    return this.http
      .put<Products>(`${this.baseUrl}/product-update/${id}`, productData, {
        headers: headers
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("ProductService: Error updating product:", error);
          return throwError(() => error);
        })
      );
  }

  getProductById(id: string): Observable<Products> {
    console.log("ProductService: Fetching product by ID:", id);
    const headers = this.authService.getAuthHeaders();

    return this.http
      .get<Products>(`${this.baseUrl}/product/${id}`, {
        headers: headers
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("ProductService: Error fetching product:", error);
          return throwError(() => error);
        })
      );
  }

  getAllProducts(): Observable<Products[]> {
    console.log("ProductService: Fetching all products");

    if (!this.authService.getToken()) {
      console.error("ProductService: No valid token found");
      return throwError(() => new Error("No valid token"));
    }

    return this.http
      .get<Products[]>(`${this.baseUrl}/data/expose/products`, {
        headers: this.authService.getAuthHeaders()
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error("ProductService: Error fetching all products:", error);
          if (error.status === 403) {
            this.authService.logout();
          }
          return throwError(() => error);
        })
      );
  }
}
