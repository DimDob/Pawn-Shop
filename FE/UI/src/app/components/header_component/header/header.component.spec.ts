// UI/src/app/components/header_component/header/header.component.spec.ts
import { FormsModule } from "@angular/forms"; // Добавен импорт
import { NO_ERRORS_SCHEMA } from "@angular/core"; // Добавен импорт
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";
import { CartService } from "../../cart_page_component/cart-page/cart.service";
import { SearchService } from "../../../shared/services/search.service";
import { Router, NavigationEnd } from "@angular/router";
import { AuthService } from "../../../app.service";
import { FavoritesService } from "../../favorites_component/favorites/favorites.service";
import { BehaviorSubject, of } from "rxjs";
import { provideRouter } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { User } from "../../auth_component/login/login_interfaces.ts/User";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let searchService: jasmine.SpyObj<SearchService>;
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;
  let favoritesService: jasmine.SpyObj<FavoritesService>;

  const mockItems$ = new BehaviorSubject<any[]>([]);
  const mockFavorites$ = new BehaviorSubject<any[]>([]);
  const mockEvents$ = new BehaviorSubject<any>(new NavigationEnd(1, "/", "/"));

  // Добавяне на mockUser
  const mockUser = {
    id: 1,
    loginUsername: "testUser",
    isAdmin: false,
    isEmployee: false,
    role: "user"
  };

  // Добавяне на mockToken
  const mockToken = "mocked-jwt-token";

  beforeEach(async () => {
    // Инициализиране на шпи обектите
    cartService = jasmine.createSpyObj("CartService", ["addToCart", "removeFromCart"], {
      items$: mockItems$.asObservable()
    });

    searchService = jasmine.createSpyObj("SearchService", ["setSearchTerm", "setSelectedCategory", "setSortOption"]);

    router = jasmine.createSpyObj("Router", ["navigate", "navigateByUrl"], {
      events: mockEvents$.asObservable()
    });

    // Добавяне на 'getCurrentUser' и 'getToken' към AuthService шпи обекта
    authService = jasmine.createSpyObj("AuthService", ["logout", "getCurrentUser", "getToken"]);
    authService.getCurrentUser.and.returnValue(mockUser as unknown as User); // Задаване на стойност
    authService.getToken.and.returnValue(mockToken); // Задаване на стойност

    favoritesService = jasmine.createSpyObj("FavoritesService", ["addToFavorites", "removeFromFavorites"], {
      favorites$: mockFavorites$.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        FormsModule, // Добавен FormsModule
        MatToolbarModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        NoopAnimationsModule
      ],
      declarations: [HeaderComponent],
      providers: [{ provide: CartService, useValue: cartService }, { provide: SearchService, useValue: searchService }, { provide: Router, useValue: router }, { provide: AuthService, useValue: authService }, { provide: FavoritesService, useValue: favoritesService }, provideRouter([])],
      schemas: [NO_ERRORS_SCHEMA] // Добавено
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should update cart count when items change", () => {
    const mockItems = [{ product: { id: 1 }, quantity: 2 }];
    mockItems$.next(mockItems);
    fixture.detectChanges();

    expect(component.cartItemCount()).toBe(2);
  });

  it("should update favorites count when favorites change", () => {
    const mockFavoriteItems = [{ id: 1 }, { id: 2 }];
    mockFavorites$.next(mockFavoriteItems);
    fixture.detectChanges();

    expect(component.favoritesCount()).toBe(2);
  });

  it("should handle category change", () => {
    const category = "Electronics";
    component.onCategoryChange(category);

    expect(searchService.setSelectedCategory).toHaveBeenCalledWith(category);
    expect(component.currentCategory()).toBe(category);
  });

  it("should handle search", () => {
    const searchTerm = "test";
    component.searchTerm.set(searchTerm);
    component.onSearch();

    expect(searchService.setSearchTerm).toHaveBeenCalledWith(searchTerm);
  });

  it("should handle logout", () => {
    component.onLogout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/auth/login"]);
  });

  it("should reset and navigate home", async () => {
    await component.onResetAndNavigateHome();

    expect(component.searchTerm()).toBe("");
    expect(component.currentCategory()).toBe("");
    expect(searchService.setSearchTerm).toHaveBeenCalledWith("");
    expect(searchService.setSelectedCategory).toHaveBeenCalledWith("");
    expect(searchService.setSortOption).toHaveBeenCalledWith("");
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it("should update page status on navigation", () => {
    mockEvents$.next(new NavigationEnd(1, "/cart", "/cart"));
    fixture.detectChanges();

    expect(component.isCartPage()).toBeTrue();

    mockEvents$.next(new NavigationEnd(1, "/favorites", "/favorites"));
    fixture.detectChanges();

    expect(component.isFavoritesPage()).toBeTrue();
  });
});
