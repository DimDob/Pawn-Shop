// UI\src\app\components\add_product_component\add-product\add-product.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
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
  productTypes: ProductType[] = [];

  constructor(private fb: FormBuilder, private router: Router, private notificationService: NotificationService, private productService: ProductService, private authService: AuthService) {
    this.initForm();
  }

  ngOnInit() {
    this.loadProductTypes();
  }

  private initForm() {
    this.addProductForm = this.fb.group({
      picture: [null],
      color: [""],
      size: [""],
      sex: [""],
      manufacturer: [""],
      model: [""],
      name: ["", Validators.required],
      category: ["", Validators.required],
      condition: ["", Validators.required],
      price: ["", [Validators.required, Validators.min(0)]],
      quantityInStock: ["", Validators.required],
      productTypeId: ["", Validators.required]
    });

    // Subscribe to category changes
    this.addProductForm.get("category")?.valueChanges.subscribe(category => {
      this.updateProductTypeId(category);
    });
  }

  private loadProductTypes() {
    this.productService.getProductTypes().subscribe({
      next: types => {
        console.log("AddProductComponent: Loaded product types:", types);
        this.productTypes = types;

        // If form has category value, update productTypeId
        const category = this.addProductForm.get("category")?.value;
        if (category) {
          this.updateProductTypeId(category);
        }
      },
      error: error => {
        console.error("AddProductComponent: Error loading product types:", error);
        this.notificationService.showError("Error loading product types");
      }
    });
  }

  private updateProductTypeId(category: string) {
    const matchingType = this.productTypes.find(type => type.name === category);
    if (matchingType) {
      console.log("AddProductComponent: Setting productTypeId to:", matchingType.id);
      this.addProductForm.patchValue({ productTypeId: matchingType.id }, { emitEvent: false });
    }
  }

  submitForm() {
    console.log("AddProductComponent: Form submitted");
    if (this.addProductForm.invalid) {
      console.error("AddProductComponent: Form is invalid", this.addProductForm.errors);
      return;
    }

    const formData = new FormData();
    const formValue = this.addProductForm.value;
    console.log("AddProductComponent: Form values:", formValue);

    // Convert form values to FormData, handling the base64 image
    Object.keys(formValue).forEach(key => {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        if (key === "picture") {
          // Image is already in base64 format
          formData.append(key, formValue[key]);
        } else {
          formData.append(key, formValue[key].toString());
        }
      }
    });

    this.productService.addProduct(formData).subscribe({
      next: response => {
        console.log("AddProductComponent: Product added successfully", response);
        this.notificationService.showSuccess("Product added successfully");
        this.router.navigate(["/pawn-shop/main-page"]);
      },
      error: error => {
        console.error("AddProductComponent: Error adding product", error);
        this.notificationService.showError("Error adding product: " + error.message);
      }
    });
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      console.log("AddProductComponent: Selected file:", file.name);

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        console.log("AddProductComponent: Converted image to base64");

        this.addProductForm.patchValue({
          picture: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
