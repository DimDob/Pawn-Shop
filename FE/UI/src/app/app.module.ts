import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/auth_component/login/login.component';
import { RegisterComponent } from './components/auth_component/register/register.component';
import { HttpClientModule } from '@angular/common/http'
import { AuthService } from './app.service';
import { ChangePasswordComponent } from './components/auth_component/change-password/change-password.component';
import { MatchPasswordsDirective } from './components/auth_component/directives/password-match.directive';
import { ChangePasswordService } from './components/auth_component/change-password/change-password.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    MatchPasswordsDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService, ChangePasswordService],
  bootstrap: [AppComponent]
})
export class AppModule { }
