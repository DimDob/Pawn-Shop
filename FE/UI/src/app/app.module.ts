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

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, MainPageComponent, AuthComponent, ChangePasswordComponent, MatchPasswordsDirective, HeaderComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule, MatToolbarModule, MatButtonModule, MatIconModule, MatInputModule, MatSelectModule],
  providers: [AuthService, ChangePasswordService, SeedDataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
