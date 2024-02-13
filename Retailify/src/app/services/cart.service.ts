import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../Cart.module';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/cartItems';  
  private cartSubject = new BehaviorSubject<string[]>(this.loadCartFromLocalStorage() );
  cart$ = this.cartSubject.asObservable();
  private userIdentifier : string | null = null;
  public cartItems : Cart;

  constructor(private http: HttpClient, private productService : ProductService) { }

  loginBuyerToCart(userIdentifier : string , countOfProducts: any[]){

     const storedCart = localStorage.getItem(`buyersCart_${userIdentifier}`);

    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      this.cartSubject.next(parsedCart);
      localStorage.setItem('Currentcart',storedCart);
      // Set inCart values based on the products in the cart
      countOfProducts.forEach((productId) => {
        const inCartValue = parsedCart.includes(productId);
        this.setInCart(productId, inCartValue);
        this.productService.getProductsById(productId).subscribe((products)=>{
        
          this.cartItems = {
            "image" :products.imageUrl,
            "model": products.model,
            "name": products.name,
            "price": products.price,
            "quantity": 1,
            "id":0
          };
  
          this.setInCartItems(JSON.stringify(products.id),JSON.stringify(this.cartItems));
      });
    });
    } else {
      // If there is no cart in local storage, set an empty cart
      this.cartSubject.next([]);

      // Set inCart values to false for all products initially
      countOfProducts.forEach((productId) => {
        this.setInCart(productId, false);
      });
    }
     this.userIdentifier = userIdentifier;
  }
  logout(countOfProducts: any[]) {
    this.cartSubject.next([]);
    localStorage.removeItem(`Currentcart`);
    countOfProducts.forEach((productId) => {
      localStorage.removeItem(`inCart_${productId}`); 
      localStorage.removeItem(`inCartItems_${productId}`);
    });
    this.userIdentifier = null;
  }

  isInCart(productId: any): boolean {
    const inCartValue = localStorage.getItem(this.getInCartKey(productId));
    return inCartValue === 'true';
  }

  private setInCart(productId: string, value: boolean): void {
    localStorage.setItem(this.getInCartKey(productId), String(value));
  }
  private setInCartItems(productId: string, value: string): void{
    localStorage.setItem(this.getInCartItems(productId),value);
  }

  public getInCartItems(productId:string)
  {
    return `${'inCartItems_'}${productId}`;
  }
  private getInCartKey(productId: string): string {
    return `${'inCart_'}${productId}`;
  }
  private saveCartToLocalStorage(cart: string[]): void {
    localStorage.setItem(`buyersCart_${this.userIdentifier}`, JSON.stringify(cart));
    localStorage.setItem('Currentcart', JSON.stringify(cart));
  }

  private loadCartFromLocalStorage(): string[] {
    const cartString = localStorage.getItem('Currentcart');
    return cartString ? JSON.parse(cartString) : [];
  }
  
  addToCart(productId: any) {
    const currentCart = this.cartSubject.value;
    const updatedCart = [...currentCart, productId];
    
    if (!this.isInCart(productId)) {
      this.cartSubject.next(updatedCart);
      this.productService.getProductsById(productId).subscribe((products)=>{
        
        this.cartItems = {
          "image" :products.imageUrl,
          "model": products.model,
          "name": products.name,
          "price": products.price,
          "quantity": 1,
          "id":products.id
        };

        this.setInCartItems(JSON.stringify(products.id),JSON.stringify(this.cartItems));

      });
      if (this.userIdentifier){
      this.saveCartToLocalStorage(updatedCart);
      }
      this.setInCart(productId, true);
    }

     
  }

  
  removeFromCart(productId: string): Observable<void> {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter((id) => JSON.stringify(id) !== productId);
    this.cartSubject.next(updatedCart);
    localStorage.removeItem(`inCartItems_${productId}`);
    localStorage.removeItem(`inCart_${JSON.parse(productId)}`);
    this.saveCartToLocalStorage(updatedCart);
  
    // Return an observable indicating completion
    return new Observable((observer) => {
      observer.next();
      observer.complete();
    });
  }
}