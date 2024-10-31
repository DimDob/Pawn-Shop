// UI\src\app\components\add_product_component\add-product\add-product.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute, Router } from "@angular/router";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";

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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private seedDataService: SeedDataService, private router: Router) {
    this.addProductForm = this.fb.group({
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
    // Обработваме избора на файл
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addProductForm.patchValue({
        picture: file
      });
    }
  }
  ngOnInit(): void {
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
    if (this.productId !== null) {
      const product = this.seedDataService.products.find(p => p.id === this.productId);
      if (product) {
        this.addProductForm.patchValue(product);
      } else {
        console.error("Product not found");
        this.router.navigate(["/not-found"]);
      }
    }
  }

  submitForm() {
    if (this.addProductForm.invalid) {
      return;
    }
    const formData = this.addProductForm.value;

    if (this.isEditMode && this.productId !== null) {
      const index = this.seedDataService.products.findIndex(p => p.id === this.productId);
      if (index !== -1) {
        this.seedDataService.products[index] = { id: this.productId, ...formData };
      }
    } else {
      const newId = Date.now().toString();
      const ownerId = "1";
      this.seedDataService.products.push({
        id: newId,
        ownerId,
        ...formData,
        category: formData.category as Category
      });
    }

    this.router.navigate(["/pawn-shop/main-page"]);
  }
}
