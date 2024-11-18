// UI\src\app\components\my-products\my-products.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MyProductsComponent } from "./my-products.component";
import { ProductService } from "../../../shared/services/product.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";

describe("MyProductsComponent", () => {
  let component: MyProductsComponent;
  let fixture: ComponentFixture<MyProductsComponent>;
  let productServiceMock: any;
  let notificationServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Create mock services
    productServiceMock = jasmine.createSpyObj("ProductService", ["getMyProducts"]);
    notificationServiceMock = jasmine.createSpyObj("NotificationService", ["showError"]);
    routerMock = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [MyProductsComponent],
      imports: [FontAwesomeModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule, FormsModule, BrowserAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProductsComponent);
    component = fixture.componentInstance;
  });

  it("must create the component", () => {
    // Check if the component is created successfully
    expect(component).toBeTruthy();
  });

  it("must load products on initialization", () => {
    const mockProducts: Products[] = [
      {
        id: "1",
        picture: "image1.jpg",
        name: "Product 1",
        category: Category.ELECTRONICS,
        price: 100,
        productTypeId: "type1",
        createdAt: "2024-01-01",
        description: "Description 1"
      },
      {
        id: "2",
        picture: "image2.jpg",
        name: "Product 2",
        category: Category.CLOTHING,
        price: 200,
        productTypeId: "type2",
        createdAt: "2024-02-01",
        description: "Description 2"
      }
    ];

    productServiceMock.getMyProducts.and.returnValue(of(mockProducts));

    // Call ngOnInit
    component.ngOnInit();

    // Check if products are loaded correctly
    expect(productServiceMock.getMyProducts).toHaveBeenCalled();

    // Access the protected property via bracket notation
    expect(component["products"]()).toEqual(mockProducts);
  });

  it("must show an error when products fail to load", () => {
    const errorResponse = new Error("Failed to load");

    productServiceMock.getMyProducts.and.returnValue(throwError(() => errorResponse));

    // Call ngOnInit
    component.ngOnInit();

    // Check if the error is handled correctly
    expect(productServiceMock.getMyProducts).toHaveBeenCalled();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Failed to load products. Please try again later.");
  });

  it("must navigate to product details on click", () => {
    const productId = "123";

    // Call the method via bracket notation
    component["goToDetails"](productId);

    // Check if navigation is called with the correct parameters
    expect(routerMock.navigate).toHaveBeenCalledWith(["/product", productId]);
  });

  it("should show empty state message when no products exist", () => {
    productServiceMock.getMyProducts.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    const emptyStateElement = fixture.debugElement.query(By.css(".empty-state"));
    expect(emptyStateElement).toBeTruthy();

    const message = fixture.debugElement.query(By.css(".empty-state-content p"));
    expect(message.nativeElement.textContent).toContain("You haven't created any products yet");
  });

  it("should navigate to add product page when clicking add product button", () => {
    component.navigateToAddProduct();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/product-add"]);
  });
});
