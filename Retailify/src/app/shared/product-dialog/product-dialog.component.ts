import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ProductDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public authService : AuthService) {
    this.form = fb.group({
      imageUrl: ['', Validators.required],
      name: ['', Validators.required],
      model: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      inCart: [false, Validators.required],
      category: [this.getDefaultCategory(), Validators.required]
    });

    if (data && data.product) {
      // If editing, patch the existing values to the form
      this.form.patchValue(data.product);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  private getDefaultCategory(){
    // Assuming your authService has a method to get the logged-in user's information
    const loggedInUser = this.authService.getLoggedInSellerCategory();
    console.log("hiiii" , loggedInUser);
    // Assuming the user object has a property like 'category'
    if (loggedInUser && loggedInUser.productcategories) {
      return loggedInUser.productcategories;
    }
  }
  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}