import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './components/main_page_component/main-page/main-page.component';
import { AuthComponent } from './components/auth_component/auth/auth.component';
import { ChangePasswordComponent } from './components/auth_component/change-password/change-password.component';


const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: AuthComponent },
  {path: 'pawn-shop/main-page', component: MainPageComponent},
  { path: 'auth/change-password/:userId', component: ChangePasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
