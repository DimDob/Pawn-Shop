// UI\src\app\components\favorites_component\favorites\favorites.component.spec.ts

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FavoritesComponent } from "./favorites.component";
import { FavoritesService } from "./favorites.service";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { NotificationService } from "../../../shared/services/notification.service";
import { Router } from "@angular/router";
import { of, throwError, BehaviorSubject } from "rxjs";
import { Products } from "../../main_page_component/main-page/Interfaces/Products";
import { Category } from "../../main_page_component/main-page/enums/Category";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

describe("FavoritesComponent", () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let favoritesServiceMock: any;
  let cartServiceMock: any;
  let notificationServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Create mock services
    favoritesServiceMock = jasmine.createSpyObj("FavoritesService", ["removeFromFavorites"]);
    favoritesServiceMock.favorites$ = new BehaviorSubject<Products[]>([
      {
        id: "1",
        picture: "image1.jpg",
        name: "Product 1",
        category: Category.ELECTRONICS,
        price: 100,
        productTypeId: "type1",
        createdAt: "2024-01-01",
        manufacturer: "Manufacturer A",
        model: "Model X",
        condition: "new"
      },
      {
        id: "2",
        picture: "image2.jpg",
        name: "Product 2",
        category: Category.CLOTHING,
        price: 200,
        productTypeId: "type2",
        createdAt: "2024-02-01",
        manufacturer: "Manufacturer B",
        model: "Model Y",
        condition: "used"
      }
    ]);

    cartServiceMock = jasmine.createSpyObj("CartService", ["addToCart"]);
    notificationServiceMock = jasmine.createSpyObj("NotificationService", ["showSuccess", "showError"]);
    routerMock = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      declarations: [FavoritesComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: FavoritesService, useValue: favoritesServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("must create the component", () => {
    // Check if the component is created successfully
    expect(component).toBeTruthy();
  });

  it("must load favorites on initialization", () => {
    // Check if favoriteProducts are loaded correctly
    expect(component.favoriteProducts.length).toBe(2);
    expect(component.favoriteProducts[0].name).toBe("Product 1");
    expect(component.favoriteProducts[1].name).toBe("Product 2");
  });

  it("must calculate the total value of favorites", () => {
    const totalValue = component.getTotalValue();
    expect(totalValue).toBe(300);
  });

  it("must add a product to the cart on purchase request", () => {
    const mockProduct: Products = {
      id: "1",
      picture: "image1.jpg",
      name: "Product 1",
      category: Category.ELECTRONICS,
      price: 100,
      productTypeId: "type1",
      createdAt: "2024-01-01",
      manufacturer: "Manufacturer A",
      model: "Model X",
      condition: "new"
    };

    // Call the method
    component.addToCart(mockProduct);

    // Check if the product is added to the cart
    expect(cartServiceMock.addToCart).toHaveBeenCalledWith(mockProduct);
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith("Product added to cart");
  });

  it("must remove a product from favorites on successful request", () => {
    const productId = "1";

    // Set up removeFromFavorites to return a successful response
    favoritesServiceMock.removeFromFavorites.and.returnValue(of("Product removed"));

    // Call the method
    component.removeFromFavorites(productId);

    // Check if removeFromFavorites is called with the correct ID
    expect(favoritesServiceMock.removeFromFavorites).toHaveBeenCalledWith(productId);

    // Check if NotificationService is called with a success message
    expect(notificationServiceMock.showSuccess).toHaveBeenCalledWith("Product removed from favorites");
  });

  it("must show an error when removing a product from favorites fails", () => {
    const productId = "1";
    const errorResponse = new Error("Failed to remove");

    // Set up removeFromFavorites to return an error
    favoritesServiceMock.removeFromFavorites.and.returnValue(throwError(() => errorResponse));

    // Call the method
    component.removeFromFavorites(productId);

    // Check if NotificationService is called with an error message
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Failed to remove product");
  });

  it("must navigate to the product details on click", () => {
    const productId = "2";

    // Call the method
    component.goToDetails(productId);

    // Check if navigation is called with the correct parameters
    expect(routerMock.navigate).toHaveBeenCalledWith(["/product", productId]);
  });

  it("must manage subscriptions when destroying the component", () => {
    spyOn(component["subscription"], "unsubscribe");

    // Call ngOnDestroy
    component.ngOnDestroy();

    // Check if subscriptions are unsubscribed
    expect(component["subscription"].unsubscribe).toHaveBeenCalled();
  });

  it("must show an empty message if there are no favorites", () => {
    // Set up favorites$ to return an empty array
    favoritesServiceMock.favorites$.next([]);

    // Update the component
    fixture.detectChanges();

    // Check if the empty message is displayed
    const emptyMessage: DebugElement = fixture.debugElement.query(By.css(".empty-favorites"));
    expect(emptyMessage).toBeTruthy();

    // Check if "No favorite products yet" is visible
    const messageText = emptyMessage.query(By.css("p")).nativeElement.textContent;
    expect(messageText).toContain("No favorite products yet");
  });

  it("must show a list of favorites if there are any", () => {
    // Set up favorites$ to return several products
    favoritesServiceMock.favorites$.next([
      {
        id: "3",
        picture: "image3.jpg",
        name: "Product 3",
        category: Category.JEWELRY,
        price: 300,
        productTypeId: "type3",
        createdAt: "2024-03-01",
        manufacturer: "Manufacturer C",
        model: "Model Z",
        condition: "like new"
      }
    ]);

    // Update the component
    fixture.detectChanges();

    // Check if the favorites list is displayed
    const favoritesList: DebugElement = fixture.debugElement.query(By.css(".favorites-list"));
    expect(favoritesList).toBeTruthy();

    // Check if the product is displayed correctly
    const favoriteItem = favoritesList.query(By.css(".favorite-item"));
    expect(favoriteItem).toBeTruthy();
    const productName = favoriteItem.query(By.css(".product-info h2")).nativeElement.textContent;
    expect(productName).toContain("Manufacturer C Model Z");
  });
});
