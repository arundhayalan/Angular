import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './forms/forms.component';
import { MaterialModule } from '../material.module';
import { HeaderComponent } from './layouts/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';


import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { ProductsComponent } from './products/products.component';
import { SellerDirective } from './seller.directive';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

import { SharedRoutingModule } from './shared-routing.module';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';





@NgModule({
  declarations: [FormsComponent, HeaderComponent, HomeComponent, RegisterComponent,ProductsComponent,ProductDialogComponent, SellerDirective, ConfirmationDialogComponent, LoadingSpinnerComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    SharedRoutingModule,
    RouterModule
  ],exports:[FormsComponent,HeaderComponent,HomeComponent , RegisterComponent]
})
export class SharedModule { }