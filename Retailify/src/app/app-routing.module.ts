import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'buyers', loadChildren: () => import('./buyers/buyers.module').then(m => m.BuyersModule) },
  { path: 'sellers', loadChildren: () => import('./sellers/sellers.module').then(m => m.SellersModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }