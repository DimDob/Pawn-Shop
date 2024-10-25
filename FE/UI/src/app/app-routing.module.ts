// UI\src\app\app-routing.module.ts

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { authGuard } from "./shared/guards/auth.guard";
import { adminGuard } from "./shared/guards/admin.guard";

import { MainPageComponent } from "./components/main_page_component/main-page/main-page.component";
import { AuthComponent } from "./components/auth_component/auth/auth.component";
import { ChangePasswordComponent } from "./components/auth_component/change-password/change-password.component";
import { AboutUsComponent } from "./components/about_us_component/about-us/about-us.component";
import { ContactsComponent } from "./components/contacts_component/contacts/contacts.component";
import { DetailsPageComponent } from "./components/details_page_component/details-page/details-page.component";
import { CartPageComponent } from "./components/cart_page_component/cart-page/cart-page.component";
import { SuccessPageComponent } from "./components/success_page_component/success-page/success-page.component";
import { MyAccountComponent } from "./components/my_account_component/my-account/my-account.component";
const routes: Routes = [
  { path: "", redirectTo: "auth/login", pathMatch: "full" },
  { path: "product/:id", component: DetailsPageComponent },
  { path: "auth", redirectTo: "auth/login", pathMatch: "full" },
  { path: "auth/login", component: AuthComponent },
  { path: "my-account", component: MyAccountComponent },
  { path: "pawn-shop/main-page", component: MainPageComponent },
  { path: "auth/change-password/:userId", component: ChangePasswordComponent },
  { path: "cart", component: CartPageComponent },
  { path: "success", component: SuccessPageComponent },
  { path: "about-us", component: AboutUsComponent },
  { path: "contacts", component: ContactsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
