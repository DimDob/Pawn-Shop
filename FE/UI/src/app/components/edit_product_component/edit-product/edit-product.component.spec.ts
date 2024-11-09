// UI/src/app/components/edit_product_component/edit-product/edit-product.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { EditProductComponent } from "./edit-product.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../../shared/services/product.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { AuthService } from "../../../app.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { of, throwError, BehaviorSubject } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { ProductType } from "../../../shared/interfaces/product-type.interface";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

describe("EditProductComponent", () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let mockActivatedRoute: any;
  let mockProductService: any;
  let mockNotificationService: any;
  let mockRouter: any;
  let mockAuthService: any;

  const mockProduct: Products = {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
    picture: "http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png",
    color: "blue",
    size: 12,
    sex: "male",
    manufacturer: "Nike",
    model: "Air Max",
    name: "Nike Air Max",
    category: Category.CLOTHING,
    price: 100,
    ownerId: "746d68ff-1002-4c71-82e0-177a648ef988",
    quantityInStock: 1,
    isRunOutOfStock: false,
    condition: "new",
    productTypeId: "type1",
    createdAt: "2024-01-01"
  };

  const mockProductTypes: ProductType[] = [
    { id: "type1", name: "Clothing" },
    { id: "type2", name: "Electronics" }
    // Add more mock product types as needed
  ];

  beforeEach(waitForAsync(() => {
    // Mock ActivatedRoute
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            if (key === "id") {
              return mockProduct.id;
            }
            return null;
          }
        }
      }
    };

    // Mock ProductService
    mockProductService = jasmine.createSpyObj(["getProductById", "getProductTypes", "updateProduct"]);
    mockProductService.getProductById.and.returnValue(of(mockProduct));
    mockProductService.getProductTypes.and.returnValue(of(mockProductTypes));
    mockProductService.updateProduct.and.returnValue(of("Product updated successfully"));

    // Mock NotificationService
    mockNotificationService = jasmine.createSpyObj(["showSuccess", "showError"]);
    mockNotificationService.showSuccess.and.stub();
    mockNotificationService.showError.and.stub();

    // Mock Router
    mockRouter = jasmine.createSpyObj(["navigate"]);

    // Mock AuthService
    mockAuthService = jasmine.createSpyObj(["getCurrentUser"]);
    mockAuthService.getCurrentUser.and.returnValue({
      id: "746d68ff-1002-4c71-82e0-177a648ef988",
      loginUsername: "user@example.com",
      isAdmin: false,
      isEmployee: false
    });

    TestBed.configureTestingModule({
      declarations: [EditProductComponent],
      imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductService, useValue: mockProductService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create EditProductComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with product data on ngOnInit", fakeAsync(() => {
    // Wait for async operations
    tick();
    fixture.detectChanges();

    expect(component.productId()).toBe(mockProduct.id);
    expect(component.currentProduct()).toEqual(mockProduct);
    expect(component.editProductForm.value.name).toBe(mockProduct.name);
    expect(component.editProductForm.value.manufacturer).toBe(mockProduct.manufacturer);
    expect(component.editProductForm.value.model).toBe(mockProduct.model);
    expect(component.editProductForm.value.category).toBe(mockProduct.category);
    expect(component.editProductForm.value.price).toBe(mockProduct.price);
    expect(component.editProductForm.value.color).toBe(mockProduct.color);
    expect(component.editProductForm.value.size).toBe(mockProduct.size);
    expect(component.editProductForm.value.sex).toBe(mockProduct.sex);
    expect(component.editProductForm.value.productTypeId).toBe(mockProduct.productTypeId);
  }));

  it("should load product types and set productTypeId based on category", fakeAsync(() => {
    tick();
    fixture.detectChanges();

    expect(mockProductService.getProductTypes).toHaveBeenCalled();
    expect(component.productTypes).toEqual(mockProductTypes);
    expect(component.editProductForm.value.productTypeId).toBe("type1");
  }));

  it("should handle error when loading product types", fakeAsync(() => {
    mockProductService.getProductTypes.and.returnValue(throwError(() => new Error("Failed to load product types")));
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(mockNotificationService.showError).toHaveBeenCalledWith("Error loading product types");
    expect(component.productTypes).toEqual([]);
  }));

  it("should update productTypeId when category changes", fakeAsync(() => {
    tick();
    fixture.detectChanges();

    const newCategory = "Electronics";
    const newProductTypeId = "type2";

    // Change the category in the form
    component.editProductForm.controls["category"].setValue(newCategory);
    fixture.detectChanges();
    tick();

    expect(component.editProductForm.value.productTypeId).toBe(newProductTypeId);
  }));

  it("should handle file input change and set picture as base64 string", fakeAsync(() => {
    const dummyFile = new File(["dummy content"], "example.png", { type: "image/png" });
    const event = {
      target: {
        files: [dummyFile]
      }
    } as unknown as Event;

    // Spy on FileReader methods
    const fileReaderSpy = jasmine.createSpyObj("FileReader", ["readAsDataURL", "onload"]);
    (window as any).FileReader = jasmine.createSpy().and.returnValue(fileReaderSpy);

    component.onFileChange(event);
    fixture.detectChanges();

    expect(fileReaderSpy.readAsDataURL).toHaveBeenCalledWith(dummyFile);

    // Simulate the onload event
    const base64String = "data:image/png;base64,dummybase64string";
    fileReaderSpy.onload({ target: { result: base64String } } as any);

    expect(component.editProductForm.value.picture).toBe(base64String);
  }));

  it("should submit the form and update the product", fakeAsync(() => {
    tick();
    fixture.detectChanges();

    // Update form values
    component.editProductForm.controls["name"].setValue("Updated Product Name");
    component.editProductForm.controls["manufacturer"].setValue("Updated Manufacturer");
    component.editProductForm.controls["model"].setValue("Updated Model");
    component.editProductForm.controls["category"].setValue(Category.ELECTRONICS);
    component.editProductForm.controls["price"].setValue(150);
    component.editProductForm.controls["color"].setValue("Red");
    component.editProductForm.controls["size"].setValue(14);
    component.editProductForm.controls["sex"].setValue("unisex");

    // Update productTypeId based on new category
    component["updateProductTypeId"](Category.ELECTRONICS);
    fixture.detectChanges();
    tick();

    // Submit the form
    component.submitForm();
    tick();
    fixture.detectChanges();

    expect(mockProductService.updateProduct).toHaveBeenCalledWith(
      mockProduct.id,
      jasmine.objectContaining({
        name: "Updated Product Name",
        manufacturer: "Updated Manufacturer",
        model: "Updated Model",
        category: Category.ELECTRONICS,
        price: 150,
        color: "Red",
        size: 14,
        sex: "unisex",
        productTypeId: "type2"
      })
    );
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Product updated successfully");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/pawn-shop/main-page"]);
  }));

  it("should handle error when updating the product", fakeAsync(() => {
    mockProductService.updateProduct.and.returnValue(throwError(() => new Error("Update failed")));
    tick();
    fixture.detectChanges();

    // Submit the form
    component.submitForm();
    tick();
    fixture.detectChanges();

    expect(mockProductService.updateProduct).toHaveBeenCalled();
    expect(mockNotificationService.showError).toHaveBeenCalledWith("Error updating product: Update failed");
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it("should display error message when form is invalid and submitted", fakeAsync(() => {
    tick();
    fixture.detectChanges();

    // Invalidate the form by clearing required fields
    component.editProductForm.controls["name"].setValue("");
    component.editProductForm.controls["manufacturer"].setValue("");
    component.editProductForm.controls["model"].setValue("");
    component.editProductForm.controls["category"].setValue("");
    component.editProductForm.controls["price"].setValue(null);
    component.editProductForm.controls["color"].setValue("");
    component.editProductForm.controls["size"].setValue(null);
    component.editProductForm.controls["sex"].setValue("");

    fixture.detectChanges();

    // Submit the form
    component.submitForm();
    tick();
    fixture.detectChanges();

    expect(component.errorMessage()).toBe("Please fill all required fields");
    expect(mockProductService.updateProduct).not.toHaveBeenCalled();
    expect(mockNotificationService.showSuccess).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  }));

  it("should navigate to not-found page if product ID is missing", fakeAsync(() => {
    // Modify the ActivatedRoute to return null for 'id'
    mockActivatedRoute.snapshot.paramMap.get = (key: string) => null;

    // Reinitialize the component
    fixture.destroy();
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    expect(component.productId()).toBe("");
    expect(component.currentProduct()).toBeNull();
    expect(component.errorMessage()).toBe("Product ID not found");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/not-found"]);
  }));

  it("should disable submit button if form is invalid", fakeAsync(() => {
    tick();
    fixture.detectChanges();

    // Invalidate the form
    component.editProductForm.controls["name"].setValue("");
    component.editProductForm.controls["manufacturer"].setValue("");
    component.editProductForm.controls["model"].setValue("");
    component.editProductForm.controls["category"].setValue("");
    component.editProductForm.controls["price"].setValue(null);

    fixture.detectChanges();

    const submitButton: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeTrue();
  }));

  it("should enable submit button if form is valid", fakeAsync(() => {
    tick();
    fixture.detectChanges();

    // Ensure the form is valid
    component.editProductForm.controls["name"].setValue("Valid Name");
    component.editProductForm.controls["manufacturer"].setValue("Valid Manufacturer");
    component.editProductForm.controls["model"].setValue("Valid Model");
    component.editProductForm.controls["category"].setValue(Category.CLOTHING);
    component.editProductForm.controls["price"].setValue(200);

    // Set optional fields if necessary
    component.editProductForm.controls["color"].setValue("Green");
    component.editProductForm.controls["size"].setValue(14);
    component.editProductForm.controls["sex"].setValue("female");

    fixture.detectChanges();
    tick();

    const submitButton: DebugElement = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton.nativeElement.disabled).toBeFalse();
  }));
});
