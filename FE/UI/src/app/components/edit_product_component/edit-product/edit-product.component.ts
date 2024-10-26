// UI\src\app\components\edit_product_component\edit-product\edit-product.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute, Router } from "@angular/router";
import { SeedDataService } from "../../main_page_component/main-page/seedData/seed-data.service";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";

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

  productId: number | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private seedDataService: SeedDataService, private router: Router) {
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
    this.route.paramMap.subscribe(params => {
      const idParam = params.get("id");
      if (idParam) {
        this.productId = +idParam;
        this.loadProductData();
      } else {
        console.error("No product ID provided.");
        this.router.navigate(["/not-found"]);
      }
    });
  }

  loadProductData() {
    if (this.productId !== null) {
      const product = this.seedDataService.products.find(p => p.id === this.productId);
      if (product) {
        this.editProductForm.patchValue(product);
      } else {
        console.error("Product not found");
        this.router.navigate(["/not-found"]);
      }
    }
  }

  submitForm() {
    if (this.editProductForm.invalid) {
      return;
    }
    const updatedProduct: Products = {
      id: this.productId!,
      ...this.editProductForm.value
    };

    const index = this.seedDataService.products.findIndex(p => p.id === this.productId);
    if (index !== -1) {
      this.seedDataService.products[index] = updatedProduct;
    } else {
      console.error("Product not found in the list.");
    }

    this.router.navigate(["/pawn-shop/main-page"]);
  }
}
