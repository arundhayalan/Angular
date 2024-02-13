import { Component, OnInit } from '@angular/core';
import { ProductDialogComponent } from '../../shared/product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../Product.module';

import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { User } from '../../user.model';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  cartSubscription: Subscription;
  sellerProductCategory: string | undefined;
  filteredProducts: Product[] = [];
  private Searchedsubscription: Subscription;
  private categorysubscription: Subscription;
  selectedCategory: string = '';

  


  constructor(private productService: ProductService,private snackBar: MatSnackBar, public dialog: MatDialog, private router: Router, private authService : AuthService, private cartService : CartService) {
 
    
  }

  ngOnInit(): void {
    
      this.loadProducts();
      this.Searchedsubscription = this.productService.getFilteredProducts().subscribe(filteredProducts => {
        this.filteredProducts = filteredProducts;
      });

      this.categorysubscription = this.productService.selectedCategory$.subscribe((category)=>{
       this.selectedCategory = category;
       console.log(this.selectedCategory);
       this.loadProducts();
      })
      
  
      
  }
  ngOnDestroy() {
    this.Searchedsubscription.unsubscribe();
    this.categorysubscription.unsubscribe();
  }
  
  


  loadProducts() {
    const LoggedInUser = localStorage.getItem('userRole');
    if(LoggedInUser === 'seller'){
    this.authService.getLoggedInUser().subscribe(

      (seller:User | null) =>{
        if(seller)
        {
          this.sellerProductCategory = seller.productcategories;

          this.productService.getProductsByCategory(this.sellerProductCategory!).subscribe(

          (productsAll : Product[]) =>
          {
            this.products = productsAll;
            console.log(this.products);
          },
          (error) => {
            console.error('Error fetching products:', error);
          }
          );
        }else{
          console.warn('User is not logged in.');
        }
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
      );
    }
    else if(LoggedInUser === 'buyer' || LoggedInUser === 'guest')
    {
      this.productService.getProducts().subscribe(
        (products: Product[]) => {
          this.products = this.filterProductsByCategory(products);;
          this.filteredProducts = this.products;
        },
        (error) => {
          console.error('Error fetching products:', error);
        }
      );
    }
  }

  private filterProductsByCategory(products: Product[]): Product[] {
    if (this.selectedCategory) {
      return products.filter(product => product.category === this.selectedCategory);
    } else {
      return products;
    }
  }

  onCartGuestClick(){
    
    const snackBarRef= this.snackBar.open(' Need to Login First ', 'Go-to-Login', {
      duration: 3000,
    });
    snackBarRef.onAction().subscribe(() => {
      // Navigate to the desired page when "Close" is clicked
      this.router.navigate(['buyers/login']); // Replace '/your-page' with the actual route you want to navigate to
    });
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent,{
      data:{mode:'add'}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.addProduct(result).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  onEditClick(product: Product) : void {
    console.log("Itz clicking");
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data:{mode:'edit', product: product},
    });

    dialogRef.afterClosed().subscribe((results)=> {

      if(results)
      {
        this.productService.updateProduct(product.id, results).subscribe(() =>{
          this.loadProducts();
        });
      }
    });
  }

  onDeleteClick(product: Product): void {
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      width: '400px', // Set the width of the dialog as per your requirement
      disableClose: true, // Disable closing the dialog by clicking outside
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to Delete?',
      }
    });

    dialogRef.afterClosed().subscribe(sellerConfirmed =>{

      if(sellerConfirmed)
      {
        setTimeout(() => {
        this.productService.deleteProduct(product.id).subscribe(() => {
          this.loadProducts();
        });
      }, 200);
      }
    });
    
  }

  oncartClick(product: Product){
    
    console.log(product.inCart);
    const incartkey = this.cartService.isInCart(product.id);
    if(incartkey)
    {
      const snackBarRef= this.snackBar.open('Selected Item is Already in The Cart           ', 'Go-to-Cart', {
        duration: 3000,
      });
      snackBarRef.onAction().subscribe(() => {
        // Navigate to the desired page when "Close" is clicked
        this.router.navigate(['buyers/cart']); // Replace '/your-page' with the actual route you want to navigate to
      });
    }
    else if (!product.inCart) {
      this.cartService.addToCart(product.id);
    } else {
      this.router.navigate(['buyers/cart']);
    }

    // Toggle the inCart state for the clicked product
    product.inCart = !product.inCart;
  }

}