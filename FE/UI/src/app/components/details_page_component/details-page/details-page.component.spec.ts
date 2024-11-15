// UI/src/app/components/details_page_component/details-page/details-page.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { DetailsPageComponent } from "./details-page.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "../../../shared/services/product.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { FavoritesService } from "../../favorites_component/favorites/favorites.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { AuthService } from "../../../app.service";
import { of, throwError, BehaviorSubject } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

describe("DetailsPageComponent", () => {
  let component: DetailsPageComponent;
  let fixture: ComponentFixture<DetailsPageComponent>;
  let mockActivatedRoute: any;
  let mockProductService: any;
  let mockCartService: any;
  let mockFavoritesService: any;
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
    createdAt: "2024-01-01",
    description: "This is a test description"
  };

  beforeEach(async () => {
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
    mockProductService = jasmine.createSpyObj(["getProductById", "deleteProduct"]);
    mockProductService.getProductById.and.returnValue(of(mockProduct));
    mockProductService.deleteProduct.and.returnValue(of("Product deleted successfully"));

    // Mock CartService
    mockCartService = jasmine.createSpyObj(["addToCart"]);
    mockCartService.addToCart.and.stub();

    // Mock FavoritesService
    mockFavoritesService = jasmine.createSpyObj(["isProductFavorite", "addToFavorites", "removeFromFavorites"]);
    mockFavoritesService.isProductFavorite.and.returnValue(false);
    mockFavoritesService.addToFavorites.and.returnValue(of("Product added to favorites"));
    mockFavoritesService.removeFromFavorites.and.returnValue(of("Product removed from favorites"));

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

    await TestBed.configureTestingModule({
      declarations: [DetailsPageComponent],
      imports: [FormsModule, MatIconModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
        { provide: FavoritesService, useValue: mockFavoritesService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  /**
   * Функция за създаване на компонента. Използва се във всяка тестова функция след настройката на моковете.
   */
  const createComponent = () => {
    fixture = TestBed.createComponent(DetailsPageComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  };

  it("should create DetailsPageComponent", () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it("should initialize the product correctly in ngOnInit", fakeAsync(() => {
    createComponent();
    tick();
    fixture.detectChanges();

    expect(component.product()).toEqual(mockProduct);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  }));

  it("should handle error when product is not found", fakeAsync(() => {
    mockProductService.getProductById.and.returnValue(throwError(() => new Error("Product not found")));

    createComponent();
    tick();
    fixture.detectChanges();

    expect(component.product()).toBeNull();
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe("Error loading product");
    expect(mockNotificationService.showError).toHaveBeenCalledWith("Error loading product details");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/not-found"]);
  }));

  it("should add product to cart with specified quantity", fakeAsync(() => {
    createComponent();
    component.quantity.set(2);
    component.onAddToCart();
    tick();
    fixture.detectChanges();

    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduct, 2);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Product added to cart");
  }));

  it("should add product to cart with default quantity 1", fakeAsync(() => {
    createComponent();
    component.quantity.set(1);
    component.onAddToCart();
    tick();
    fixture.detectChanges();

    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduct, 1);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Product added to cart");
  }));

  it("should not add product to cart if quantity is 0 or less", fakeAsync(() => {
    createComponent();
    component.quantity.set(0);
    component.onAddToCart();
    tick();
    fixture.detectChanges();

    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduct, 0);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Product added to cart");
  }));

  it("should navigate to edit product page if user is the owner", fakeAsync(() => {
    createComponent();
    component.onEditProduct();
    tick();
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(["/pawn-shop/edit-product", mockProduct.id]);
  }));

  it("should confirm deletion of the product", fakeAsync(() => {
    createComponent();
    component.onConfirmDelete();
    tick();
    fixture.detectChanges();

    expect(component.showConfirmModal()).toBeTrue();
  }));

  it("should delete the product successfully", fakeAsync(() => {
    createComponent();
    component.onDeleteProduct();
    tick();
    fixture.detectChanges();

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(mockProduct.id);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Product deleted successfully");
    expect(component.showConfirmModal()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/pawn-shop/main-page"]);
  }));

  it("should handle error when deleting the product", fakeAsync(() => {
    mockProductService.deleteProduct.and.returnValue(throwError(() => new Error("Deletion failed")));

    createComponent();
    component.onDeleteProduct();
    tick();
    fixture.detectChanges();

    expect(mockProductService.deleteProduct).toHaveBeenCalledWith(mockProduct.id);
    expect(mockNotificationService.showError).toHaveBeenCalledWith("Error deleting product");
    expect(component.showConfirmModal()).toBeFalse();
  }));

  it("should cancel deletion of the product", fakeAsync(() => {
    createComponent();
    component.onConfirmDelete();
    tick();
    fixture.detectChanges();

    expect(component.showConfirmModal()).toBeTrue();

    component.onCancelDelete();
    tick();
    fixture.detectChanges();

    expect(component.showConfirmModal()).toBeFalse();
  }));

  it("should toggle favorite status to add to favorites", fakeAsync(() => {
    mockFavoritesService.isProductFavorite.and.returnValue(false);
    mockFavoritesService.addToFavorites.and.returnValue(of("Product added to favorites"));

    createComponent();
    component.onToggleFavorite();
    tick();
    fixture.detectChanges();

    expect(mockFavoritesService.addToFavorites).toHaveBeenCalledWith(mockProduct.id);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Added to favorites");
  }));

  it("should toggle favorite status to remove from favorites", fakeAsync(() => {
    mockFavoritesService.isProductFavorite.and.returnValue(true);
    mockFavoritesService.removeFromFavorites.and.returnValue(of("Product removed from favorites"));

    createComponent();
    component.onToggleFavorite();
    tick();
    fixture.detectChanges();

    expect(mockFavoritesService.removeFromFavorites).toHaveBeenCalledWith(mockProduct.id);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith("Removed from favorites");
  }));

  it("should handle error when adding to favorites", fakeAsync(() => {
    mockFavoritesService.isProductFavorite.and.returnValue(false);
    mockFavoritesService.addToFavorites.and.returnValue(throwError(() => new Error("Add to favorites failed")));

    createComponent();
    component.onToggleFavorite();
    tick();
    fixture.detectChanges();

    expect(mockFavoritesService.addToFavorites).toHaveBeenCalledWith(mockProduct.id);
    expect(mockNotificationService.showError).toHaveBeenCalledWith("Failed to add to favorites");
  }));

  it("should handle error when removing from favorites", fakeAsync(() => {
    mockFavoritesService.isProductFavorite.and.returnValue(true);
    mockFavoritesService.removeFromFavorites.and.returnValue(throwError(() => new Error("Remove from favorites failed")));

    createComponent();
    component.onToggleFavorite();
    tick();
    fixture.detectChanges();

    expect(mockFavoritesService.removeFromFavorites).toHaveBeenCalledWith(mockProduct.id);
    expect(mockNotificationService.showError).toHaveBeenCalledWith("Failed to remove from favorites");
  }));

  it("should determine if the current user is the owner", fakeAsync(() => {
    createComponent();
    tick();
    fixture.detectChanges();

    const isOwner = component.isOwner();
    expect(isOwner).toBeTrue();
  }));

  it("should determine if the product is favorite", fakeAsync(() => {
    mockFavoritesService.isProductFavorite.and.returnValue(true);
    mockProductService.getProductById.and.returnValue(of(mockProduct));

    createComponent();
    tick();
    fixture.detectChanges();

    expect(component.isFavorite()).toBeTrue();
  }));

  it("should handle missing product ID in route", fakeAsync(() => {
    mockActivatedRoute.snapshot.paramMap.get = (key: string) => null;

    fixture = TestBed.createComponent(DetailsPageComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(component.product()).toBeNull();
    expect(component.error()).toBe("Product ID not found");
    expect(mockRouter.navigate).toHaveBeenCalledWith(["/not-found"]);
  }));
});
