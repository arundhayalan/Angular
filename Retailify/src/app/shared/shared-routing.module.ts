import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from '../shared/products/products.component';
import { HomeComponent } from './home/home.component';



const routes: Routes = [
  {path:'list-of-products',component: ProductsComponent},
  {path:'home', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }