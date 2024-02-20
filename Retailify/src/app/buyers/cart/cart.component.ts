import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Cart } from 'src/app/Cart.module';
import { CartService } from 'src/app/services/cart.service';

import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {


  cartItems : any[] = [];
  private cartItemsList = JSON.parse(localStorage.getItem('Currentcart')) || [];

  showAddressFormFlag: boolean = false;
  addressForm: FormGroup;
  isDesktop: boolean = false;
  isMobile: boolean = false;
 

  ngOnInit(): void {
    this.observeScreenSize();
    this.loadCartItems();
  }

  constructor(private cartService : CartService,  public dialog: MatDialog, private breakpointObserver: BreakpointObserver, private router : Router){

    console.log(typeof(this.cartItemsList));
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

  showAddressForm(): void {
    this.router.navigate(['/buyers/checkout']);
  }

  loadCartItems() {
    const cartItemsList = JSON.parse(localStorage.getItem('Currentcart')) || [];
    this.cartItems = cartItemsList.map((productId) => {
      const inCartValue = JSON.parse(localStorage.getItem(this.cartService.getInCartItems(JSON.stringify(productId)))) || {};
      return inCartValue;
    });
  }

  

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  removeItem(item : Cart) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      width: '400px', // Set the width of the dialog as per your requirement
      disableClose: true, // Disable closing the dialog by clicking outside
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to Delete?',
      }
    });

    dialogRef.afterClosed().subscribe((buyerConfirmed)=>{

      if(buyerConfirmed){
        setTimeout(() => {
          this.cartService.removeFromCart(JSON.stringify(item.id)).subscribe(() => {
            this.loadCartItems();
          });
        }, 200);
      }

    })
  }

  calculateTotal() {
    return this.cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  }
}