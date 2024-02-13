import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  
  count: any;
  countOfProducts : any[] = [];
  loginForm: FormGroup;
  email: string;
  password: string;
  constructor(private fb: FormBuilder,private authService : AuthService, private cartService : CartService) {

    
  }
  ngOnInit(): void {
     this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
     });

  }
  onSubmit() {
    
    this.email = this.loginForm.get('email').value;
    this.password = this.loginForm.get('password').value;
    this.countOfProducts = JSON.parse(localStorage.getItem(`buyersCart_${this.email}`)) || [];
    this.authService.loginBuyer(this.email, this.password);
    this.cartService.loginBuyerToCart(this.email, this.countOfProducts);
    console.log(this.countOfProducts);
    console.log('Form submitted:', this.loginForm.value);
  }
}