// UI/src/app/components/add_product_component/add-product/add-product.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { AddProductComponent } from "./add-product.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../app.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { ProductService } from "../../../shared/services/product.service";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { of, throwError } from "rxjs";
import { By } from "@angular/platform-browser";

describe("AddProductComponent", () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let routerMock: any;
  let authServiceMock: any;
  let notificationServiceMock: any;
  let productServiceMock: any;

  // Create MockFileReader class
  class MockFileReader {
    onload: () => void = () => {};
    result: string | ArrayBuffer | null = null;

    readAsDataURL(file: Blob) {
      this.result = "data:image/png;base64,dummybase64string";
      this.onload();
    }
  }

  beforeEach(async () => {
    // Create mock router
    routerMock = {
      navigate: jasmine.createSpy("navigate")
    };

    authServiceMock = {
      // Add methods if necessary
    };

    notificationServiceMock = {
      showSuccess: jasmine.createSpy("showSuccess"),
      showError: jasmine.createSpy("showError")
    };

    productServiceMock = {
      getProductTypes: jasmine.createSpy("getProductTypes").and.returnValue(
        of([
          { id: "1", name: "Electronics" },
          { id: "2", name: "Clothing" },
          { id: "3", name: "Jewelry" },
          { id: "4", name: "Art" },
          { id: "5", name: "Other" }
        ])
      ),
      addProduct: jasmine.createSpy("addProduct")
    };

    // Configure TestBed with necessary modules and providers
    await TestBed.configureTestingModule({
      declarations: [AddProductComponent],
      imports: [ReactiveFormsModule, FormsModule, FontAwesomeModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ProductService, useValue: productServiceMock }
      ]
    })
      .overrideComponent(AddProductComponent, {
        set: {
          // Mock FileReader globally
          providers: [
            {
              provide: FileReader,
              useClass: MockFileReader
            }
          ]
        }
      })
      .compileComponents();
  });

  beforeEach(() => {
    // Create component instance and initialize
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the AddProductComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with default values and validators", fakeAsync(() => {
    // Simulate async operations
    tick();
    fixture.detectChanges();

    const form = component.addProductForm;
    expect(form).toBeDefined();

    // Check initial values of the form
    expect(form.get("name")?.value).toBe("");
    expect(form.get("manufacturer")?.value).toBe("");
    expect(form.get("model")?.value).toBe("");
    expect(form.get("category")?.value).toBe("");
    expect(form.get("price")?.value).toBe("");
    expect(form.get("color")?.value).toBe("");
    expect(form.get("size")?.value).toBe("");
    expect(form.get("sex")?.value).toBe("");
    expect(form.get("picture")?.value).toBeNull();
    expect(form.get("productTypeId")?.value).toBe("");
    expect(form.get("description")?.value).toBe("");
    expect(form.get("quantityInStock")?.value).toBe("");

    // Check validity of the controls
    expect(form.get("name")?.valid).toBeFalse();
    expect(form.get("manufacturer")?.valid).toBeTrue(); // Optional field
    expect(form.get("model")?.valid).toBeTrue(); // Optional field
    expect(form.get("category")?.valid).toBeFalse();
    expect(form.get("price")?.valid).toBeFalse();
    expect(form.get("color")?.valid).toBeTrue(); // Optional field
    expect(form.get("size")?.valid).toBeTrue(); // Optional field
    expect(form.get("sex")?.valid).toBeFalse();
    expect(form.get("picture")?.valid).toBeTrue(); // Optional field
    expect(form.get("productTypeId")?.valid).toBeFalse();
    expect(form.get("description")?.valid).toBeFalse();
    expect(form.get("quantityInStock")?.valid).toBeFalse();
  }));

  it("should load product types on initialization", fakeAsync(() => {
    // Simulate async operations
    tick();
    fixture.detectChanges();

    expect(productServiceMock.getProductTypes).toHaveBeenCalled();
    expect(component.productTypes.length).toBeGreaterThan(0);
    expect(component.productTypes).toEqual([
      { id: "1", name: "Electronics" },
      { id: "2", name: "Clothing" },
      { id: "3", name: "Jewelry" },
      { id: "4", name: "Art" },
      { id: "5", name: "Other" }
    ]);
  }));

  it("should handle error when loading product types fails", fakeAsync(() => {
    // Set getProductTypes to return an error
    productServiceMock.getProductTypes.and.returnValue(throwError({ message: "Failed to load product types" }));

    // Refresh the component
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(productServiceMock.getProductTypes).toHaveBeenCalled();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Error loading product types");
  }));

  it("should update productTypeId when category changes", fakeAsync(() => {
    // Set product types
    component.productTypes = [
      { id: "1", name: "Electronics" },
      { id: "2", name: "Clothing" }
    ];

    // Change category
    component.addProductForm.get("category")?.setValue("Clothing");
    tick();
    fixture.detectChanges();

    expect(component.addProductForm.get("productTypeId")?.value).toBe("2");
  }));

  it("should not update productTypeId if category does not match any product type", fakeAsync(() => {
    // Set product types
    component.productTypes = [
      { id: "1", name: "Electronics" },
      { id: "2", name: "Clothing" }
    ];

    // Change category to an invalid value
    component.addProductForm.get("category")?.setValue("Food");
    tick();
    fixture.detectChanges();

    expect(component.addProductForm.get("productTypeId")?.value).toBe("");
  }));

  it("should handle file input change and convert image to base64", fakeAsync(() => {
    // Create mock file
    const mockFile = new File(["dummy content"], "test-image.png", { type: "image/png" });
    const event = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    // Mock FileReader
    Object.defineProperty(window, "FileReader", {
      writable: true,
      value: MockFileReader
    });

    // Call onFileChange
    component.onFileChange(event);
    tick();
    fixture.detectChanges();

    expect(component.addProductForm.get("picture")?.value).toBe("data:image/png;base64,dummybase64string");
  }));

  it("should submit form successfully when form is valid", fakeAsync(() => {
    // Set valid data in the form
    component.addProductForm.patchValue({
      name: "Test Product",
      manufacturer: "Test Manufacturer",
      model: "Model X",
      category: "Electronics",
      price: 99.99,
      color: "Red",
      size: 42,
      sex: "none",
      productTypeId: "1",
      picture: "data:image/png;base64,dummybase64string",
      description: "This is a test description",
      quantityInStock: 10
    });

    // Simulate async operations
    tick();
    fixture.detectChanges();

    // Set addProduct to return successfully
    productServiceMock.addProduct.and.returnValue(of({ success: true }));

    // Submit the form
    component.submitForm();
    tick();

    expect(productServiceMock.addProduct).toHaveBeenCalled();
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith("Product added successfully");
    expect(routerMock.navigate).toHaveBeenCalledWith(["/pawn-shop/main-page"]);
  }));

  it("should handle error when submitting the form fails", fakeAsync(() => {
    // Set valid data in the form
    component.addProductForm.patchValue({
      name: "Test Product",
      manufacturer: "Test Manufacturer",
      model: "Model X",
      category: "Electronics",
      price: 99.99,
      color: "Red",
      size: 42,
      sex: "none",
      productTypeId: "1",
      picture: "data:image/png;base64,dummybase64string",
      description: "This is a test description",
      quantityInStock: 10
    });

    // Simulate async operations
    tick();
    fixture.detectChanges();

    // Set addProduct to return an error
    productServiceMock.addProduct.and.returnValue(throwError({ message: "Failed to add product" }));

    // Submit the form
    component.submitForm();
    tick();

    expect(productServiceMock.addProduct).toHaveBeenCalled();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Error adding product: Failed to add product");
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));

  it("should not submit form if form is invalid", () => {
    // Set invalid data in the form
    component.addProductForm.patchValue({
      name: "",
      manufacturer: "",
      model: "",
      category: "",
      price: -10, // Невалидна цена
      color: "",
      size: "",
      sex: "",
      productTypeId: "",
      picture: null,
      description: "",
      quantityInStock: -10 // Невалидно количество
    });
    fixture.detectChanges();

    // Submit the form
    component.submitForm();

    expect(productServiceMock.addProduct).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
    // You can add a check for showError if necessary
  });

  it("should display error message when errorMessage is set", () => {
    // Set errorMessage
    component.errorMessage = "An error occurred";
    fixture.detectChanges();

    // Search for the error message element
    const errorMsgElement: HTMLElement = fixture.debugElement.query(By.css(".error-message")).nativeElement;

    expect(errorMsgElement).toBeTruthy();
    expect(errorMsgElement.textContent).toContain("An error occurred");
  });

  it("should not display error message when errorMessage is empty", () => {
    // Set errorMessage
    component.errorMessage = "";
    fixture.detectChanges();

    // Search for the error message element
    const errorMsgElement = fixture.debugElement.query(By.css(".error-message"));

    expect(errorMsgElement).toBeNull();
  });

  it("should track categories correctly in the template", () => {
    // Set categories
    component.categories = [Category.ELECTRONICS, Category.CLOTHING, Category.ART, Category.OTHER, Category.JEWELRY];
    fixture.detectChanges();

    // Search for all options in the category select
    const optionElements = fixture.debugElement.queryAll(By.css('select[formControlName="category"] option'));

    expect(optionElements.length).toBe(6); // Including "Select Category"
    expect(optionElements[0].nativeElement.value).toBe("");
    expect(optionElements[1].nativeElement.value).toBe(Category.ELECTRONICS);
    expect(optionElements[2].nativeElement.value).toBe(Category.CLOTHING);
    expect(optionElements[3].nativeElement.value).toBe(Category.ART);
    expect(optionElements[4].nativeElement.value).toBe(Category.OTHER);
    expect(optionElements[5].nativeElement.value).toBe(Category.JEWELRY);
  });

  it("should disable the submit button when the form is invalid", () => {
    // Set invalid data in the form
    component.addProductForm.patchValue({
      name: "",
      manufacturer: "",
      model: "",
      category: "",
      price: -10, // Invalid price
      color: "",
      size: "",
      sex: "",
      productTypeId: "",
      picture: null,
      description: "",
      quantityInStock: -10 // Invalid quantity
    });
    fixture.detectChanges();

    // Search for the submit button
    const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;

    expect(submitButton.disabled).toBeTrue();
  });

  it("should enable the submit button when the form is valid", fakeAsync(() => {
    // Set valid data in the form
    component.addProductForm.patchValue({
      name: "Test Product",
      manufacturer: "Test Manufacturer",
      model: "Model X",
      category: "Electronics",
      price: 99.99,
      color: "Red",
      size: 42,
      sex: "none",
      productTypeId: "1",
      picture: "data:image/png;base64,dummybase64string",
      description: "This is a test description",
      quantityInStock: 10
    });

    // Simulate async operations
    tick();
    fixture.detectChanges();

    // Search for the submit button
    const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;

    expect(submitButton.disabled).toBeFalse();
  }));
});
