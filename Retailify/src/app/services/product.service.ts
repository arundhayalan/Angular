import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { Product } from '../Product.module';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/products'; 
  
  private searchInputSubject = new BehaviorSubject<string>('');
  searchInput$ = this.searchInputSubject.asObservable();
  
  private selectedCategorySource = new BehaviorSubject<string>('');
  selectedCategory$ = this.selectedCategorySource.asObservable();

  constructor(private http: HttpClient) {}

  changeSearchInput(searchInput: string) {
    this.searchInputSubject.next(searchInput);
  }

  getFilteredProducts(): Observable<Product[]> {
    return this.searchInput$.pipe(
      debounceTime(300), // wait for 300 milliseconds pause in events
      distinctUntilChanged(), // only emit if the new value is different from the previous one
      switchMap(searchInput =>
        this.fetchProducts(searchInput)
      )
    );
  }

  private fetchProducts(searchInput: string): Observable<Product[]> {
  const url = `${this.apiUrl}/?name=${searchInput}`;
  return this.http.get<Product[]>(url);
}


  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(productId: number, product: Product):Observable<Product>{
     const url = `${this.apiUrl}/${productId}`;
     return this.http.put<Product>(url,product);
  }

  deleteProduct(productId: number): Observable<void> {
    const url = `${this.apiUrl}/${productId}`;
    return this.http.delete<void>(url);
  }

  getCategories(): Observable<string[]> {
    return this.getProducts().pipe(
      map((products) => {
        // Extract unique categories from the product data
        return [...new Set(products.map((product) => product.category))];
      })
    );
  }
  
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}?category=${category}`);
  }

  updateSelectedCategory(category: string): void {
    this.selectedCategorySource.next(category);
   
  }

  getProductsById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productId}`);
  }
  
 
  
  
 

  
  
}