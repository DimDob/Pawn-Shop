// UI/src/app/app-routing.module.ts

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
import { AddProductComponent } from "./components/add_product_component/add-product/add-product.component";
import { MyProductsComponent } from "./components/my_products_component/my-products/my-products.component";
import { EditProductComponent } from "./components/edit_product_component/edit-product/edit-product.component";
import { RegisterComponent } from "./components/auth_component/register/register.component";
import { NotFoundComponent } from "./components/not-found_component/not-found/not-found.component";
import { FavoritesComponent } from "./components/favorites_component/favorites/favorites.component";
import { ServerErrorComponent } from "./components/server-error_component/server-error/server-error.component";
import { LoginComponent } from "./components/auth_component/login/login.component";
import { ConfirmEmailComponent } from "./components/auth_component/confirm-email/confirm-email.component";
import { ForgotPasswordComponent } from "./components/auth_component/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./components/auth_component/reset-password/reset-password.component";
import { OrderSummaryComponent } from "./components/order-summary/order-summary.component";
import { AdminOrdersComponent } from "./components/admin/admin-orders/admin-orders.component";
// import { AdminProductsComponent } from "./components/admin/admin-products/admin-products.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full"
  },
  {
    path: "auth",
    component: AuthComponent,
    children: [
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "register",
        component: RegisterComponent
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent
      },
      {
        path: "reset-password",
        component: ResetPasswordComponent
      },
      {
        path: "confirm-email",
        component: ConfirmEmailComponent
      },
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
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
  {
    path: "order-summary",
    component: OrderSummaryComponent,
    canActivate: [authGuard]
  },
  { path: "server-error", component: ServerErrorComponent },
  {
    path: "admin/orders",
    component: AdminOrdersComponent,
    canActivate: [authGuard, adminGuard]
  },

  { path: "**", redirectTo: "/home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
