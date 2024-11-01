// UI\src\app\components\edit_product_component\edit-product\edit-product.component.ts
import { Component, OnInit } from "@angular/core";
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
  editProductForm: FormGroup;
  categories = Object.values(Category);
  errorMessage = "";
  public faEdit = faEdit;

  productId: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private seedDataService: SeedDataService, private router: Router, private notificationService: NotificationService) {
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
  }
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.editProductForm.patchValue({
        picture: file
      });
    }
  }
  ngOnInit(): void {
    console.log("EditProductComponent: Initialization");
    this.route.paramMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        this.productId = id;
        this.loadProductData(id);
      }
    });
  }

  loadProductData(id: string) {
    const product = this.seedDataService.products.find(p => p.id === id);
    if (product) {
      console.log("EditProductComponent: Retrieving product data", product);
      this.editProductForm.patchValue(product);
    } else {
      console.error("EditProductComponent: Product not found");
      this.notificationService.showError("Product not found");
      this.router.navigate(["/not-found"]);
    }
  }

  submitForm() {
    if (this.editProductForm.invalid) {
      console.log("EditProductComponent: Form is invalid");
      return;
    }

    try {
      if (this.productId) {
        const formData = this.editProductForm.value;
        const index = this.seedDataService.products.findIndex(p => p.id === this.productId);

        if (index !== -1) {
          this.seedDataService.products[index] = {
            ...this.seedDataService.products[index],
            ...formData
          };
          console.log("EditProductComponent: Product updated successfully");
          this.notificationService.showSuccess("Product updated successfully");
          this.router.navigate(["/pawn-shop/main-page"]);
        }
      }
    } catch (error) {
      console.error("EditProductComponent: Error updating product", error);
      this.notificationService.showError("An error occurred while updating the product");
    }
  }
}
