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

  beforeEach(async () => {
    // Create mocks for the dependencies
    routerMock = {
      navigate: jasmine.createSpy("navigate")
    };

    authServiceMock = {
      // Add methods if needed
    };

    notificationServiceMock = {
      showSuccess: jasmine.createSpy("showSuccess"),
      showError: jasmine.createSpy("showError")
    };

    productServiceMock = {
      getProductTypes: jasmine.createSpy("getProductTypes"),
      addProduct: jasmine.createSpy("addProduct")
    };

    // Configure the TestBed with necessary modules and providers
    await TestBed.configureTestingModule({
      declarations: [AddProductComponent],
      imports: [ReactiveFormsModule, FormsModule, FontAwesomeModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ProductService, useValue: productServiceMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Create the component instance and trigger initial data binding
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the AddProductComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with default values and validators", () => {
    const form = component.addProductForm;
    expect(form).toBeDefined();

    expect(form.get("name")?.value).toBe("");
    expect(form.get("manufacturer")?.value).toBe("");
    expect(form.get("model")?.value).toBe("");
    expect(form.get("category")?.value).toBe("");
    expect(form.get("price")?.value).toBe("");
    expect(form.get("color")?.value).toBe("");
    expect(form.get("size")?.value).toBe("");
    expect(form.get("sex")?.value).toBe("");
    expect(form.get("picture")?.value).toBe(null);
    expect(form.get("productTypeId")?.value).toBe("");

    expect(form.get("name")?.valid).toBeFalse();
    expect(form.get("manufacturer")?.valid).toBeFalse();
    expect(form.get("model")?.valid).toBeFalse();
    expect(form.get("category")?.valid).toBeFalse();
    expect(form.get("price")?.valid).toBeFalse();
    expect(form.get("productTypeId")?.valid).toBeFalse();
  });

  it("should load product types on initialization", () => {
    // Arrange: Mock productService.getProductTypes to return sample data
    const mockProductTypes = [
      { id: "1", name: "Electronics" },
      { id: "2", name: "Clothing" }
    ];
    productServiceMock.getProductTypes.and.returnValue(of(mockProductTypes));

    // Act: Re-initialize the component
    component.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(productServiceMock.getProductTypes).toHaveBeenCalled();
    expect(component.productTypes).toEqual(mockProductTypes);
  });

  it("should handle error when loading product types fails", () => {
    // Arrange: Mock productService.getProductTypes to return an error
    productServiceMock.getProductTypes.and.returnValue(throwError({ message: "Failed to load product types" }));

    // Act: Re-initialize the component
    component.ngOnInit();
    fixture.detectChanges();

    // Assert
    expect(productServiceMock.getProductTypes).toHaveBeenCalled();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Error loading product types");
  });

  it("should update productTypeId when category changes", () => {
    // Arrange: Mock product types
    const mockProductTypes = [
      { id: "1", name: "Electronics" },
      { id: "2", name: "Clothing" }
    ];
    component.productTypes = mockProductTypes;

    // Act: Change category to 'Clothing'
    component.addProductForm.get("category")?.setValue("Clothing");
    fixture.detectChanges();

    // Assert
    expect(component.addProductForm.get("productTypeId")?.value).toBe("2");
  });

  it("should not update productTypeId if category does not match any product type", () => {
    // Arrange: Mock product types
    const mockProductTypes = [
      { id: "1", name: "Electronics" },
      { id: "2", name: "Clothing" }
    ];
    component.productTypes = mockProductTypes;

    // Act: Change category to a non-existing category
    component.addProductForm.get("category")?.setValue("Food");
    fixture.detectChanges();

    // Assert
    expect(component.addProductForm.get("productTypeId")?.value).toBe("");
  });

  it("should handle file input change and convert image to base64", fakeAsync(() => {
    // Arrange: Create a mock file
    const mockFile = new File(["dummy content"], "test-image.png", { type: "image/png" });
    const event = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    // Spy on FileReader
    const fileReaderSpy = spyOn(window as any, "FileReader").and.callFake(() => ({
      readAsDataURL: function () {
        this.onload();
      },
      result: "data:image/png;base64,dummybase64string",
      onload: () => {}
    }));

    // Act: Call onFileChange with the mock event
    component.onFileChange(event);
    tick(); // Simulate async FileReader

    fixture.detectChanges();

    // Assert
    expect(component.addProductForm.get("picture")?.value).toBe("data:image/png;base64,dummybase64string");
  }));

  it("should submit form successfully when form is valid", fakeAsync(() => {
    // Arrange: Set valid form values
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
      picture: "data:image/png;base64,dummybase64string"
    });

    // Mock productService.addProduct to return a success response
    productServiceMock.addProduct.and.returnValue(of({ success: true }));

    // Act: Submit the form
    component.submitForm();
    tick(); // Simulate async

    // Assert
    expect(productServiceMock.addProduct).toHaveBeenCalled();

    // Since FormData cannot be directly compared, check that addProduct was called with FormData containing specific keys
    const actualFormData: FormData = productServiceMock.addProduct.calls.mostRecent().args[0];
    expect(actualFormData.has("name")).toBeTrue();
    expect(actualFormData.get("name")).toBe("Test Product");
    expect(actualFormData.has("manufacturer")).toBeTrue();
    expect(actualFormData.get("manufacturer")).toBe("Test Manufacturer");
    expect(actualFormData.has("model")).toBeTrue();
    expect(actualFormData.get("model")).toBe("Model X");
    expect(actualFormData.has("category")).toBeTrue();
    expect(actualFormData.get("category")).toBe("Electronics");
    expect(actualFormData.has("price")).toBeTrue();
    expect(actualFormData.get("price")).toBe("99.99");
    expect(actualFormData.has("color")).toBeTrue();
    expect(actualFormData.get("color")).toBe("Red");
    expect(actualFormData.has("size")).toBeTrue();
    expect(actualFormData.get("size")).toBe("42");
    expect(actualFormData.has("sex")).toBeTrue();
    expect(actualFormData.get("sex")).toBe("none");
    expect(actualFormData.has("productTypeId")).toBeTrue();
    expect(actualFormData.get("productTypeId")).toBe("1");
    expect(actualFormData.has("picture")).toBeTrue();
    expect(actualFormData.get("picture")).toBe("data:image/png;base64,dummybase64string");

    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith("Product added successfully");
    expect(routerMock.navigate).toHaveBeenCalledWith(["/pawn-shop/main-page"]);
  }));

  it("should handle error when submitting the form fails", fakeAsync(() => {
    // Arrange: Set valid form values
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
      picture: "data:image/png;base64,dummybase64string"
    });

    // Mock productService.addProduct to return an error
    productServiceMock.addProduct.and.returnValue(throwError({ message: "Failed to add product" }));

    // Act: Submit the form
    component.submitForm();
    tick(); // Simulate async

    // Assert
    expect(productServiceMock.addProduct).toHaveBeenCalled();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Error adding product: Failed to add product");
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));

  it("should not submit form if form is invalid", () => {
    // Arrange: Set invalid form values (e.g., missing required fields)
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
      picture: null
    });

    // Act: Submit the form
    component.submitForm();

    // Assert
    expect(productServiceMock.addProduct).not.toHaveBeenCalled();
    // Depending on implementation, you might want to check if notificationService.showError was called
    // For example:
    // expect(notificationServiceMock.showError).toHaveBeenCalledWith("Please fill all required fields correctly");
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it("should display error message when errorMessage is set", () => {
    // Arrange: Set errorMessage
    component.errorMessage = "An error occurred";
    fixture.detectChanges();

    // Act: Query the error message element
    const errorMsgElement: HTMLElement = fixture.debugElement.query(By.css(".error-message")).nativeElement;

    // Assert
    expect(errorMsgElement).toBeTruthy();
    expect(errorMsgElement.textContent).toContain("An error occurred");
  });

  it("should not display error message when errorMessage is empty", () => {
    // Arrange: Ensure errorMessage is empty
    component.errorMessage = "";
    fixture.detectChanges();

    // Act: Query the error message element
    const errorMsgElement = fixture.debugElement.query(By.css(".error-message"));

    // Assert
    expect(errorMsgElement).toBeNull();
  });

  it("should track categories correctly in the template", () => {
    // Arrange: Mock categories
    component.categories = [Category.ELECTRONICS, Category.CLOTHING, Category.ART, Category.OTHER, Category.JEWELRY];
    fixture.detectChanges();

    // Act: Query all category options
    const optionElements = fixture.debugElement.queryAll(By.css('select[formControlName="category"] option'));

    // Assert
    expect(optionElements.length).toBe(6); // Including the default "Select Category"
    expect(optionElements[0].nativeElement.value).toBe("");
    expect(optionElements[1].nativeElement.value).toBe(Category.ELECTRONICS);
    expect(optionElements[2].nativeElement.value).toBe(Category.CLOTHING);
    expect(optionElements[3].nativeElement.value).toBe(Category.ART);
    expect(optionElements[4].nativeElement.value).toBe(Category.OTHER);
    expect(optionElements[5].nativeElement.value).toBe(Category.JEWELRY);
  });

  it("should disable the submit button when the form is invalid", () => {
    // Arrange: Ensure the form is invalid
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
      picture: null
    });
    fixture.detectChanges();

    // Act: Query the submit button and cast to HTMLButtonElement
    const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;

    // Assert
    expect(submitButton.disabled).toBeTrue();
  });

  it("should enable the submit button when the form is valid", () => {
    // Arrange: Set valid form values
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
      picture: "data:image/png;base64,dummybase64string"
    });
    fixture.detectChanges();

    // Act: Query the submit button and cast to HTMLButtonElement
    const submitButton: HTMLButtonElement = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;

    // Assert
    expect(submitButton.disabled).toBeFalse();
  });
});
