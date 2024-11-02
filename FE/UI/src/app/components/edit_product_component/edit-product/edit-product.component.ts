// UI\src\app\components\edit_product_component\edit-product\edit-product.component.ts
import { Component, OnInit, signal, computed, effect, inject, Signal } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute, Router } from "@angular/router";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { NotificationService } from "../../../shared/services/notification.service";

@Component({
  selector: "app-edit-product",
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.scss"]
})
export class EditProductComponent implements OnInit {
  // Public properties
  public editProductForm: FormGroup;
  public categories = Object.values(Category);
  public errorMessage = signal<string>("");
  public faEdit = faEdit;
  public productId = signal<string>("");
  public currentProduct = signal<Products | null>(null);

  // Private properties
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private seedDataService = inject(SeedDataService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  // Computed values
  public isFormValid = computed(() => this.editProductForm?.valid ?? false);

  constructor() {
    // Initialize form
    this.editProductForm = this.fb.group({
      picture: [null],
      color: ["", Validators.required],
      size: ["", Validators.required],
      sex: [""],
      manufacturer: ["", Validators.required],
      model: ["", Validators.required],
      name: ["", Validators.required],
      category: ["", Validators.required],
      price: ["", [Validators.required, Validators.min(0)]]
    });

    // Setup effect for form changes
    effect(() => {
      if (this.currentProduct()) {
        this.updateFormWithProduct(this.currentProduct()!);
      }
    });
  }

  // Lifecycle hooks
  public ngOnInit(): void {
    this.setupRouteSubscription();
  }

  // Private methods
  private setupRouteSubscription(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        this.productId.set(id);
        this.loadProductData(id);
      }
    });
  }

  private updateFormWithProduct(product: Products): void {
    this.editProductForm.patchValue(product);
  }

  // Public methods
  public onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      const file = target.files[0];
      this.editProductForm.patchValue({
        picture: file
      });
    }
  }

  public loadProductData(id: string): void {
    const product = this.seedDataService.products.find(p => p.id === id);
    if (product) {
      this.currentProduct.set(product);
    } else {
      this.errorMessage.set("Product not found");
      this.notificationService.showError("Product not found");
      this.router.navigate(["/not-found"]);
    }
  }

  public submitForm(): void {
    if (this.editProductForm.invalid) {
      this.errorMessage.set("Please fill all required fields");
      return;
    }

    try {
      const currentId = this.productId();
      if (currentId) {
        const formData = this.editProductForm.value;
        const index = this.seedDataService.products.findIndex(p => p.id === currentId);

        if (index !== -1) {
          this.seedDataService.products[index] = {
            ...this.seedDataService.products[index],
            ...formData
          };
          this.notificationService.showSuccess("Product updated successfully");
          this.router.navigate(["/pawn-shop/main-page"]);
        }
      }
    } catch (error) {
      this.errorMessage.set("An error occurred while updating the product");
      this.notificationService.showError("An error occurred while updating the product");
    }
  }
}
