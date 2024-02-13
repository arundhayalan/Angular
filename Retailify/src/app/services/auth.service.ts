import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { User } from '../user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private sellerUrl = 'http://localhost:3000/sellers';
  private buyerUrl = 'http://localhost:3000/buyers';
  private readonly USER_ROLE_KEY = 'userRole';
  private readonly PRODUCT_CATE_KEY = 'productCategories';

  private isAuthenticated = false;
  private loggedInUser: any;

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();
  private currentUserSubject = new BehaviorSubject<User>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { 

    
    this.isAuthenticated = this.checkAuthentication();
    
  }

  private checkAuthentication(): boolean {
    // Check the authentication status from localStorage
    const token = localStorage.getItem(this.USER_ROLE_KEY);
    console.log(token);
    if(token === 'guest')
    {
      console.log(!token);
      this.setUserRole(token);
      return !token;
    }
    console.log(!!token);
    this.setUserRole(token);
    return !!token;
  }

  loginBuyer(email:String, password:String)
  {
    
    const loginUrl = `${this.buyerUrl}?email=${email}&password=${password}`;
    this.http.get<User[]>(loginUrl).pipe(
      catchError(error =>{
        console.error('Error during login:', error);
        alert('Error during login. Please check the console for details.');
        return throwError(() => new Error(error));
      })
    ).subscribe(buyers => {
      if(buyers.length === 1)
      {
        const buyer = buyers[0];
        console.log("buyer", buyer);
        this.isAuthenticated = true;
        this.loggedInUser = buyer;
        this.currentUserSubject.next(buyer);
        this.setUserRole(buyer.role);
        localStorage.setItem('buyer', JSON.stringify(buyer));
        localStorage.setItem(this.USER_ROLE_KEY, buyer.role);
        localStorage.setItem('loggedIn','true');
        this.router.navigate(['buyers/list-of-products']);
      } else {
        
        console.error('Invalid Credentials');
      alert('Invalid Credentials');

      }

    });
  }
  loginseller(email: String, password:String){
    
    const loginUrl = `${this.sellerUrl}?email=${email}&password=${password}`;
    this.http.get<User[]>(loginUrl).pipe(
      catchError(error => {
        console.error('Error during login:', error);
        alert('Error during login. Please check the console for details.');
        return throwError(() => new Error(error));
      })
    ).subscribe(users => {
      if (users.length === 1) {
        const user = users[0];
        console.log('Seller:', user);
        this.isAuthenticated = true;
        this.currentUserSubject.next(user);
        this.setUserRole(user.role);
        localStorage.setItem(this.PRODUCT_CATE_KEY, user.productcategories);
        localStorage.setItem(this.USER_ROLE_KEY, user.role);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('Seller', JSON.stringify(user));
        this.router.navigate(['sellers/list-of-products']);
      } else {
        console.error('Invalid Credentials');
        alert('Invalid Credentials');
      }
    });
    
    
  }
  

  isLoggedIn() {
    return this.isAuthenticated;
  }
  
  getLoggedInUser(): Observable<User | null> {
    const storedUser = localStorage.getItem('Seller');
    if (storedUser) {
      return of(JSON.parse(storedUser));
    }
    return of(null);
  }

  getLoggedInUserId() {
      const userId= JSON.parse(localStorage.getItem('buyer'));
      console.log(userId.id);
      return userId.id;
  }

  getLoggedInSellerCategory(){
    const categoryOfSeller = JSON.parse(localStorage.getItem('Seller'));
    return categoryOfSeller;
  }
  setUserRole(role: string | null) {
    this.userRoleSubject.next(role);
  }

  getUserRole(): string | null {
    return this.userRoleSubject.value;
  }

  clearUserRole(){
    localStorage.setItem(this.USER_ROLE_KEY,'guest');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem(this.PRODUCT_CATE_KEY);
    localStorage.removeItem('Seller');
    this.isAuthenticated = false;
    this.loggedInUser = null;
        this.currentUserSubject.next(null);
        this.userRoleSubject.next("guest");
  }
}