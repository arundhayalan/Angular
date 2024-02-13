import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellersRoutingModule } from './sellers-routing.module';

import { LoginSellerComponent } from './login-seller/login-seller.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';




@NgModule({
  declarations: [
   
    LoginSellerComponent,
     
  ],
  imports: [
    CommonModule,
    SellersRoutingModule,
    SharedModule,
    MaterialModule,
  ]
})
export class SellersModule { }