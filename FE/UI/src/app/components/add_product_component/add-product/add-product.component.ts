// UI\src\app\components\add_product_component\add-product\add-product.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "../../../shared/services/notification.service";
import { ProductService } from "../../../shared/services/product.service";
import { AuthService } from "../../../app.service";
import { ProductType } from "../../../shared/interfaces/product-type.interface";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"]
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;
  categories = Object.values(Category);
  errorMessage = "";
  public faBoxOpen = faBoxOpen;

  isEditMode = false;
  productId: string | null = null;

  productTypes: ProductType[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private notificationService: NotificationService, private productService: ProductService, private authService: AuthService) {
    this.addProductForm = this.fb.group({
      picture: [null],
      color: ["", Validators.required],
      size: ["", Validators.required],
      sex: [""],
      manufacturer: ["", Validators.required],
      model: ["", Validators.required],
      name: ["", Validators.required],
      category: ["", Validators.required],
      price: ["", [Validators.required, Validators.min(0)]],
      productTypeId: ["", Validators.required]
    });
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.addProductForm.patchValue({
          picture: reader.result as string
        });
      };

      reader.readAsDataURL(file);
    }
  }
  ngOnInit(): void {
    this.productService.getProductTypes().subscribe({
      next: types => {
        this.productTypes = types;
        if (types.length > 0) {
          this.addProductForm.patchValue({
            productTypeId: types[0].id
          });
        }
      },
      error: error => {
        console.error("Error loading product types:", error);
        this.notificationService.showError("Error loading product types");
      }
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get("id");
      if (idParam) {
        this.isEditMode = true;
        this.productId = idParam;
        this.loadProductData();
      }
    });
  }

  loadProductData() {
    console.log("AddProductComponent: Loading product data for ID:", this.productId);
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe({
        next: product => {
          console.log("AddProductComponent: Product data loaded successfully");
          this.addProductForm.patchValue(product);
        },
        error: error => {
          console.error("AddProductComponent: Error loading product", error);
          this.notificationService.showError("Error loading product");
          this.router.navigate(["/not-found"]);
        }
      });
    }
  }

  submitForm() {
    console.log("AddProductComponent: Form submitted");
    if (this.addProductForm.invalid) {
      console.error("AddProductComponent: Form is invalid", this.addProductForm.errors);
      return;
    }

    if (!this.authService.isLoggedIn()) {
      console.error("AddProductComponent: User not authenticated");
      this.notificationService.showError("Please login to add products");
      this.router.navigate(["/auth/login"]);
      return;
    }

    const formData = new FormData();
    const formValue = this.addProductForm.value;

    // Log form values before sending
    console.log("AddProductComponent: Form values:", formValue);

    // Append all form values to FormData
    Object.keys(formValue).forEach(key => {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        formData.append(key, formValue[key].toString());
      }
    });

    console.log("AddProductComponent: Processing form data");

    this.productService.addProduct(formData).subscribe({
      next: (response) => {
        console.log("AddProductComponent: Product added successfully", response);
        this.notificationService.showSuccess("Product added successfully");
        this.router.navigate(["/pawn-shop/main-page"]);
      },
      error: (error) => {
        console.error("AddProductComponent: Error adding product", error);
        this.notificationService.showError("Error adding product: " + error.message);
      }
    });
  }
}
