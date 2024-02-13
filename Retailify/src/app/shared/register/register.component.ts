import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { group } from '@angular/animations';
import { BuyerService } from '../../services/buyer.service';
import { SellerService } from '../../services/seller.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registrationForm: FormGroup;
  
  

  constructor(private Router: Router,private fb: FormBuilder,private sellerService: SellerService,private sharedService: SharedService, private buyerService: BuyerService,private snackBar: MatSnackBar)
  {
    
  }
  ngOnInit() {
    this.sharedService.formData$.subscribe(formData => {
      this.registrationForm = formData;
      console.log(this.registrationForm);
    });
  }
  

  onSubmit() {
    if (this.registrationForm && this.registrationForm.valid) {
      console.log('Form submitted:', this.registrationForm.value);
      const user = this.registrationForm.value;
      const email = this.registrationForm.get('email').value;
      const role = this.registrationForm.get('role').value;

      

      if(role === 'buyer'){
      // Check if the email already exists
      this.buyerService.checkEmailExists(email).subscribe((exists) => {
        if (exists) {
          this.snackBar.open('Buyer Email already exists', 'Close', {
            duration: 3000,
          });
        } else {
          delete user.productcategories;
          delete user.panNumber;
          this.buyerService.addBuyer(user).subscribe((response) => {
            console.log('Buyer registered:', response);
    
          });
          this.snackBar.open('Registration successful', 'Close', {
            duration: 3000,
          });
        }
      });
    }
    else if(role === 'seller'){
      this.sellerService.checksellerEmailExists(email).subscribe((exists) => {
        if (exists) {
          this.snackBar.open('Seller Email already exists', 'Close', {
            duration: 3000,
          });
        } else {
             
      this.sellerService.addseller(user).subscribe((response) => {
            console.log('seller registered:', response);
    
          });
          this.snackBar.open('Registration successful', 'Close', {
            duration: 3000,
          });
          this.Router.navigate(['sellers/login-seller']);
        }
      });
    }
    else {
      console.log('Form is invalid. Please check the fields.');
    }
  }
  
  }
  }