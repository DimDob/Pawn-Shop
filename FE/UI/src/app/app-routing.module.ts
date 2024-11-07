// UI/src/app/app-routing.module.ts

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { authGuard } from "./shared/guards/auth.guard";

import { MainPageComponent } from "./components/main_page_component/main-page/main-page.component";
import { AuthComponent } from "./components/auth_component/auth/auth.component";
import { ChangePasswordComponent } from "./components/auth_component/change-password/change-password.component";
import { AboutUsComponent } from "./components/about_us_component/about-us/about-us.component";
import { ContactsComponent } from "./components/contacts_component/contacts/contacts.component";
import { DetailsPageComponent } from "./components/details_page_component/details-page/details-page.component";
import { CartPageComponent } from "./components/cart_page_component/cart-page/cart-page.component";
import { SuccessPageComponent } from "./components/success_page_component/success-page/success-page.component";
import { MyAccountComponent } from "./components/my_account_component/my-account/my-account.component";
import { AddProductComponent } from "./components/add_product_component/add-product/add-product.component";
import { MyProductsComponent } from "./components/my_products_component/my-products/my-products.component";
import { EditProductComponent } from "./components/edit_product_component/edit-product/edit-product.component";
import { RegisterComponent } from "./components/auth_component/register/register.component";
import { NotFoundComponent } from "./components/not-found_component/not-found/not-found.component";
import { FavoritesComponent } from "./components/favorites_component/favorites/favorites.component";
import { ServerErrorComponent } from "./components/server-error_component/server-error/server-error.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full"
  },
  {
    path: "auth",
    component: AuthComponent,
    canActivateChild: [authGuard],
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      { path: "login", component: AuthComponent },
      { path: "register", component: RegisterComponent },
      {
        path: "change-password/:userId",
        component: ChangePasswordComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: "pawn-shop",
    children: [
      {
        path: "main-page",
        component: MainPageComponent,
        canActivate: [authGuard]
      },
      {
        path: "edit-product/:id",
        component: EditProductComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: "cart",
    component: CartPageComponent,
    canActivate: [authGuard]
  },
  {
    path: "success",
    component: SuccessPageComponent,
    canActivate: [authGuard]
  },
  { path: "about-us", component: AboutUsComponent },
  { path: "contacts", component: ContactsComponent },
  {
    path: "add-product",
    component: AddProductComponent,
    canActivate: [authGuard]
  },
  {
    path: "my-products",
    component: MyProductsComponent,
    canActivate: [authGuard]
  },
  {
    path: "product/:id",
    component: DetailsPageComponent,
    canActivate: [authGuard]
  },
  {
    path: "my-account",
    children: [
      {
        path: "",
        component: MyAccountComponent,
        canActivate: [authGuard]
      },
      {
        path: "change-password",
        component: ChangePasswordComponent,
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: "favorites",
    component: FavoritesComponent,
    canActivate: [authGuard]
  },
  { path: "server-error", component: ServerErrorComponent },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
