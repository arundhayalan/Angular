import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from '../shared/register/register.component';
import { LoginSellerComponent } from './login-seller/login-seller.component';
import { ProductsComponent } from '../shared/products/products.component';
import { AuthGuard } from '../guards/auth.guard';


const routes: Routes = [
  {path:'register-seller',component: RegisterComponent},
  {path:'login-seller', component: LoginSellerComponent},
  {path:'list-of-products', component:ProductsComponent , canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellersRoutingModule { }