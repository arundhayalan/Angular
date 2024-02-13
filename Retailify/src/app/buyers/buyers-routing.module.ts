import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from '../shared/register/register.component';
import { ProductsComponent } from '../shared/products/products.component';
import { CartComponent } from './cart/cart.component';

import { CheckoutComponent } from './checkout/checkout.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  { path:'register', component: RegisterComponent},
  { path:'login', component: LoginComponent},
  { path: 'list-of-products', component:ProductsComponent, canActivate: [AuthGuard] },
  { path:'cart', component: CartComponent , canActivate: [AuthGuard]},
  {path:'checkout', component: CheckoutComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyersRoutingModule { }