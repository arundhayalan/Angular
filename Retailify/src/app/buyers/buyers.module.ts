import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyersRoutingModule } from './buyers-routing.module';



import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from '../shared/register/register.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [
    LoginComponent,
    CartComponent,
    CheckoutComponent,
   
  ],
  imports: [
    CommonModule,
    BuyersRoutingModule,
    MaterialModule,
    SharedModule,
    HttpClientModule,
    TranslateModule,
  ]
})
export class BuyersModule { }