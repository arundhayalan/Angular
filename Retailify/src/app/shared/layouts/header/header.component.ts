import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [TranslatePipe]
})
export class HeaderComponent implements OnInit {

  

  language: String = 'English';
  isDesktop: boolean = false;
  isMobile: boolean = false;
  count:any;
  countOfProducts: any[] = [];
  searchForm: FormGroup | undefined;
  categoryForm: FormGroup;
  categories: string[] = [];

  constructor(private productService: ProductService, private fb: FormBuilder,private translate: TranslateService, private router: Router,private breakpointObserver: BreakpointObserver, private authservice : AuthService, private dialog: MatDialog, private cartService : CartService) { }


  ngOnInit() {
    this.observeScreenSize();
    this.cartService.cart$.subscribe((count) => {
      this.count = count.length;
      this.countOfProducts = [...count];
    });

    this.searchForm = this.fb.group({
      searchInput: ['']
    });

    this.categoryForm = this.fb.group({
      category: [''],
    });

    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
      console.log(this.categories);
    });

    this.categoryForm.get('category').valueChanges.subscribe((category) => {
      this.productService.updateSelectedCategory(category);
      console.log(this.productService.updateSelectedCategory(category));
    });
    
    this.searchForm.get('searchInput').valueChanges.subscribe(value => {
      this.productService.changeSearchInput(value);
    });
  }
  
  

  
  observeScreenSize() {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.TabletPortrait,
    ]).subscribe(result => {
      this.isMobile = result.matches;
      this.isDesktop = !result.matches;
    });
  }

  redirectToLogin() {
    this.router.navigate(['buyers/login']);
  }

  redirectToRegisterseller(){
    this.router.navigate(['sellers/register-seller']);
  }

  redirectToLoginseller(){
    this.router.navigate(['sellers/login-seller']);

  }
  isLoggedIn(): boolean {
    return this.authservice.isLoggedIn();
  }
  
  logout() {
     
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px', // Set the width of the dialog as per your requirement
      disableClose: true, // Disable closing the dialog by clicking outside
      data: {
        title: 'Logout Confirmation',
        message: 'Are you sure you want to logout?',
      }
    });
    dialogRef.afterClosed().subscribe(sellerConfirmed => {
      if (sellerConfirmed) {
        setTimeout(() => {
          this.authservice.clearUserRole();
          this.cartService.logout(this.countOfProducts);
          this.router.navigate(['/list-of-products']);
        }, 200);
        
    }
  });
    
    
  }

  redirectToCartPage(){

    this.router.navigate(['/buyers/cart']);
  }
  

  switchLanguage(language: string) {
    this.translate.use(language);
    if (language == 'en') {
      this.language = "English";
    } else if (language == 'hn') {
      this.language = "हिंदी(Hindi)";
    }
  }

  

}