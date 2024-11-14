// UI\src\app\services\product.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Products } from "../../components/main_page_component/main-page/Interfaces/Products";
import { ProductType } from "../interfaces/product-type.interface";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../app.service";
import { catchError, switchMap, tap } from "rxjs/operators";

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

  getProductTypes(): Observable<ProductType[]> {
    console.log("ProductService: Fetching product types");
    return this.http.get<ProductType[]>(`${this.baseUrl}/data/expose/product-types`);
  }

  addProduct(productData: FormData): Observable<Products> {
    console.log("ProductService: Sending product data to backend");

    return this.getProductTypes().pipe(
      switchMap(productTypes => {
        const category = productData.get("category") as string;
        const productType = productTypes.find(pt => pt.name === category);

        if (!productType) {
          console.error("ProductService: No matching product type found for category:", category);
          return throwError(() => new Error("Invalid product category"));
        }

        const jsonData = {
          name: productData.get("name") as string,
          manufacturer: productData.get("manufacturer") as string,
          model: productData.get("model") as string,
          price: Number(productData.get("price")),
          pawnPercentage: 0.5,
          secondHandPrice: Number(productData.get("price")) * 0.8,
          picture: productData.get("picture") as string,
          category: category,
          condition: productData.get("condition") as string,
          color: productData.get("color") as string,
          size: Number(productData.get("size")),
          sex: (productData.get("sex") as string) || "none",
          quantityInStock: Number(productData.get("quantityInStock")),
          isRunOutOfStock: false,
          productTypeId: productType.id
        };

        console.log("ProductService: Sending JSON data with image");

        return this.http.post<Products>(`${this.baseUrl}/product-add`, jsonData, {
          headers: this.authService.getAuthHeaders()
        });
      }),
      catchError((error: HttpErrorResponse) => {
        console.error("ProductService: Error adding product:", error);
        return throwError(() => error);
      })
    );
  }

  updateProduct(id: string, productData: any): Observable<Products> {
    console.log("ProductService: Updating product:", id);

    return this.getProductTypes().pipe(
      switchMap(productTypes => {
        const category = productData.category;
        const productType = productTypes.find(pt => pt.name === category);

        if (!productType) {
          console.error("ProductService: No matching product type found for category:", category);
          return throwError(() => new Error("Invalid product category"));
        }

        const jsonData = {
          id: id,
          name: productData.name,
          manufacturer: productData.manufacturer,
          model: productData.model,
          price: Number(productData.price),
          pawnPercentage: 0.5,
          secondHandPrice: Number(productData.price) * 0.8,
          picture: productData.picture || null,
          category: category,
          condition: productData.condition,
          color: productData.color,
          size: Number(productData.size),
          sex: productData.sex || "none",
          quantityInStock: Number(productData.quantityInStock),
          isRunOutOfStock: false,
          productTypeId: productType.id,
          ownerId: productData.ownerId
        };

        console.log("ProductService: Sending update data:", jsonData);

        return this.http.put<Products>(`${this.baseUrl}/product-edit`, jsonData, {
          headers: this.authService.getAuthHeaders()
        });
      }),
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

  getAllProducts(sortBy?: string, category?: string, searchTerm?: string): Observable<Products[]> {
    console.log("ProductService: Fetching products with filters:", { sortBy, category, searchTerm });

    let params = new HttpParams();

    // Only add parameters if they have values
    if (sortBy && sortBy.trim() !== "") {
      params = params.set("sortBy", sortBy);
    }
    if (category && category.trim() !== "") {
      params = params.set("category", category);
    }
    if (searchTerm && searchTerm.trim() !== "") {
      params = params.set("searchTerm", searchTerm);
    }

    return this.http
      .get<Products[]>(`${this.baseUrl}/products`, {
        headers: this.authService.getAuthHeaders(),
        params: params
      })
      .pipe(
        tap(products => console.log("ProductService: Received products:", products)),
        catchError(error => {
          console.error("ProductService: Error fetching products:", error);
          return throwError(() => error);
        })
      );
  }

  deleteProduct(productId: string): Observable<string> {
    console.log("ProductService: Deleting product:", productId);

    return this.http
      .delete(`${this.baseUrl}/product-delete/${productId}`, {
        headers: this.authService.getAuthHeaders(),
        responseType: "text"
      })
      .pipe(
        tap(response => {
          console.log("ProductService: Delete successful:", response);
        }),
        catchError(error => {
          console.error("ProductService: Error deleting product:", error);
          return throwError(() => error);
        })
      );
  }

  getMyProducts(): Observable<Products[]> {
    console.log("ProductService: Fetching my products");
    return this.http.get<Products[]>(`${environment.host}/my-products`);
  }
}
