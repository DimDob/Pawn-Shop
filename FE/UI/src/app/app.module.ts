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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainPageComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
