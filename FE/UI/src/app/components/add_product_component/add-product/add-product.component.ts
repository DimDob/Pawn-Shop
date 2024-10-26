import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"]
})
export class AddProductComponent {
  // Създаваме форма за добавяне на продукт
  addProductForm: FormGroup;
  categories = Object.values(Category);
  errorMessage: string = "";
  public faBoxOpen = faBoxOpen;

  constructor(private fb: FormBuilder) {
    this.addProductForm = this.fb.group({
      picture: [null],
      color: ["", Validators.required],
      size: ["", Validators.required],
      sex: ["", Validators.required],
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

  submitForm() {
    // Изпращаме данните чрез FormData за Multipart
    const formData = new FormData();
    Object.keys(this.addProductForm.controls).forEach(key => {
      formData.append(key, this.addProductForm.get(key)?.value);
    });

    // Тук можете да изпратите formData към бекенда
    console.log("Form Data Submitted", formData);
  }
}
