import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/auth_component/login/login.component';
import { RegisterComponent } from './components/auth_component/register/register.component';
import { HttpClientModule } from '@angular/common/http'
import { AuthService } from './app.service';
import { MainPageComponent } from './components/main_page_component/main-page/main-page.component';
import { AuthComponent } from './components/auth_component/auth/auth.component';
import { ChangePasswordComponent } from './components/auth_component/change-password/change-password.component';
import { MatchPasswordsDirective } from './components/auth_component/directives/password-match.directive';
import { ChangePasswordService } from './components/auth_component/change-password/change-password.service';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { SearchIconComponent } from './components/icons/search-icon/search-icon.component';
import { MatIconModule } from '@angular/material/icon';
import { CloseIconComponent } from "./components/icons/close-icon/close-icon.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainPageComponent,
    AuthComponent,
    ChangePasswordComponent,
    MatchPasswordsDirective,
    MainHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SearchIconComponent,
    MatIconModule,
    CloseIconComponent
],
  providers: [AuthService, ChangePasswordService],
  bootstrap: [AppComponent]
})
export class AppModule { }
