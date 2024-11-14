// UI\src\app\components\edit_product_component\edit-product\edit-product.component.ts
import { Component, OnInit, signal, computed, effect, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute, Router } from "@angular/router";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { NotificationService } from "../../../shared/services/notification.service";
import { ProductService } from "../../../shared/services/product.service";
import { ProductType } from "../../../shared/interfaces/product-type.interface";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.scss"]
})
export class EditProductComponent implements OnInit {
  public editProductForm: FormGroup;
  public categories = Object.values(Category);
  public errorMessage = signal<string>("");
  public faEdit = faEdit;
  public productId = signal<string>("");
  public currentProduct = signal<Products | null>(null);
  public productTypes: ProductType[] = [];

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private productService = inject(ProductService);

  public isFormValid = computed(() => this.editProductForm?.valid ?? false);

  constructor() {
    this.initForm();
  }

  private initForm(): void {
    this.editProductForm = this.fb.group({
      picture: [null],
      color: [""],
      size: [""],
      sex: [""],
      manufacturer: [""],
      model: [""],
      condition: ["", Validators.required],
      name: ["", Validators.required],
      category: ["", Validators.required],
      price: ["", [Validators.required, Validators.min(0)]],
      productTypeId: ["", Validators.required]
    });

    this.editProductForm.get("category")?.valueChanges.subscribe(category => {
      this.updateProductTypeId(category);
    });
  }

  ngOnInit(): void {
    this.loadProductTypes();
    this.setupRouteSubscription();
  }

  private loadProductTypes(): void {
    this.productService.getProductTypes().subscribe({
      next: types => {
        console.log("EditProductComponent: Loaded product types:", types);
        this.productTypes = types;

        const category = this.editProductForm.get("category")?.value;
        if (category) {
          this.updateProductTypeId(category);
        }
      },
      error: error => {
        console.error("EditProductComponent: Error loading product types:", error);
        this.notificationService.showError("Error loading product types");
      }
    });
  }

  private updateProductTypeId(category: string): void {
    const matchingType = this.productTypes.find(type => type.name === category);
    if (matchingType) {
      console.log("EditProductComponent: Setting productTypeId to:", matchingType.id);
      this.editProductForm.patchValue({ productTypeId: matchingType.id }, { emitEvent: false });
    }
  }

  private setupRouteSubscription(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        this.productId.set(id);
        this.loadProductData(id);
      }
    });
  }

  public onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      console.log("EditProductComponent: Selected file:", file.name);

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        console.log("EditProductComponent: Converted image to base64");

        this.editProductForm.patchValue({
          picture: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  }

  public loadProductData(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: product => {
        console.log("EditProductComponent: Product loaded:", product);
        this.currentProduct.set(product);
        this.updateFormWithProduct(product);
      },
      error: error => {
        console.error("EditProductComponent: Error loading product:", error);
        this.notificationService.showError("Product not found");
        this.router.navigate(["/not-found"]);
      }
    });
  }

  private updateFormWithProduct(product: Products): void {
    this.editProductForm.patchValue({
      ...product,
      category: product.category
    });
  }

  public submitForm(): void {
    if (this.editProductForm.invalid) {
      this.errorMessage.set("Please fill all required fields");
      return;
    }

    const formData = this.editProductForm.value;
    const productId = this.productId();

    this.productService.updateProduct(productId, formData).subscribe({
      next: response => {
        console.log("EditProductComponent: Product updated successfully", response);
        this.notificationService.showSuccess("Product updated successfully");
        this.router.navigate(["/pawn-shop/main-page"]);
      },
      error: error => {
        console.error("EditProductComponent: Error updating product:", error);
        this.notificationService.showError("Error updating product: " + error.message);
      }
    });
  }
}
