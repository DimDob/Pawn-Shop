// UI\src\app\app.module.ts

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./components/auth_component/login/login.component";
import { RegisterComponent } from "./components/auth_component/register/register.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthService } from "./app.service";
import { MainPageComponent } from "./components/main_page_component/main-page/main-page.component";
import { AuthComponent } from "./components/auth_component/auth/auth.component";
import { ChangePasswordComponent } from "./components/auth_component/change-password/change-password.component";
import { MatchPasswordsDirective } from "./components/auth_component/directives/password-match.directive";
import { ChangePasswordService } from "./components/auth_component/change-password/change-password.service";
import { ProductService } from "./shared/services/product.service";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { HeaderComponent } from "./components/header_component/header/header.component";
import { AboutUsComponent } from "./components/about_us_component/about-us/about-us.component";
import { ContactsComponent } from "./components/contacts_component/contacts/contacts.component";
import { FooterComponent } from "./components/footer_component/footer/footer.component";
import { CartPageComponent } from "./components/cart_page_component/cart-page/cart-page.component";
import { SuccessPageComponent } from "./components/success_page_component/success-page/success-page.component";
import { DetailsPageComponent } from "./components/details_page_component/details-page/details-page.component";
import { SearchService } from "./shared/services/search.service";
import { MyAccountComponent } from "./components/my_account_component/my-account/my-account.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from "@angular/forms";
import { AddProductComponent } from "./components/add_product_component/add-product/add-product.component";
import { MyProductsComponent } from "./components/my_products_component/my-products/my-products.component";
import { EditProductComponent } from "./components/edit_product_component/edit-product/edit-product.component";
import { NotFoundComponent } from "./components/not-found_component/not-found/not-found.component";
import { FavoritesComponent } from "./components/favorites_component/favorites/favorites.component";
import { NotificationService } from "./shared/services/notification.service";
import { ServerErrorComponent } from "./components/server-error_component/server-error/server-error.component";
import { ErrorHandlerService } from "./shared/services/error-handler.service";
import { AuthInterceptor } from "./shared/interceptors/auth-interceptor.service";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { faUser, faBoxOpen, faLock, faStore, faHandshake, faGem, faTag, faEnvelope, faPhone, faLocationDot, faHeart } from "@fortawesome/free-solid-svg-icons";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ConfirmEmailComponent } from "./components/auth_component/confirm-email/confirm-email.component";
import { ForgotPasswordComponent } from "./components/auth_component/forgot-password/forgot-password.component";  
import { ResetPasswordComponent } from "./components/auth_component/reset-password/reset-password.component";

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, MainPageComponent, AuthComponent, ChangePasswordComponent, MatchPasswordsDirective, HeaderComponent, AboutUsComponent, ContactsComponent, FooterComponent, CartPageComponent, DetailsPageComponent, SuccessPageComponent, MyAccountComponent, AddProductComponent, MyProductsComponent, EditProductComponent, NotFoundComponent, FavoritesComponent, ServerErrorComponent, ConfirmEmailComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule, MatToolbarModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatOptionModule, MatMenuModule, FontAwesomeModule, MatPaginatorModule, MatSnackBarModule, CommonModule, RouterModule],
  providers: [
    AuthService,
    ChangePasswordService,
    SearchService,
    NotificationService,
    ProductService,
    ErrorHandlerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUser, faBoxOpen, faLock, faStore, faHandshake, faGem, faTag, faEnvelope, faPhone, faLocationDot, faHeart, faUser, faBoxOpen, faLock, faStore, faHandshake);
  }
}
