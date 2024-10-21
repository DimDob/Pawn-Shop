// UI\src\app\app.module.ts

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "./components/auth_component/login/login.component";
import { RegisterComponent } from "./components/auth_component/register/register.component";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./app.service";
import { MainPageComponent } from "./components/main_page_component/main-page/main-page.component";
import { AuthComponent } from "./components/auth_component/auth/auth.component";
import { ChangePasswordComponent } from "./components/auth_component/change-password/change-password.component";
import { MatchPasswordsDirective } from "./components/auth_component/directives/password-match.directive";
import { ChangePasswordService } from "./components/auth_component/change-password/change-password.service";
import { SeedDataService } from "./components/main_page_component/main-page/seedData/seed-data.service";

import { MatToolbarModule } from "@angular/material/toolbar"; // За тулбара
import { MatButtonModule } from "@angular/material/button"; // За бутоните
import { MatIconModule } from "@angular/material/icon"; // За иконите (ако е необходимо)
import { MatInputModule } from "@angular/material/input"; // За търсачката
import { MatSelectModule } from "@angular/material/select"; // За падащото меню

import { HeaderComponent } from "./components/header_component/header/header.component";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";

import { AboutUsComponent } from "./components/about_us_component/about-us/about-us.component";
import { ContactsComponent } from "./components/contacts_component/contacts/contacts.component";
import { FooterComponent } from "./components/footer_component/footer/footer.component";
import { CartPageComponent } from "./components/cart_page_component/cart-page/cart-page.component";
import { SuccessPageComponent } from "./components/success_page_component/success-page/success-page.component";
import { DetailsPageComponent } from "./components/details_page_component/details-page/details-page.component";
import { SearchService } from "./services/search.service"; // Импортиране на SearchService

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, MainPageComponent, AuthComponent, ChangePasswordComponent, MatchPasswordsDirective, HeaderComponent, AboutUsComponent, ContactsComponent, FooterComponent, CartPageComponent, DetailsPageComponent, SuccessPageComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, MatToolbarModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule],
  providers: [AuthService, ChangePasswordService, SeedDataService, SearchService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule {}
