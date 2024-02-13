import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private sellerUrl = 'http://localhost:3000/sellers';

  constructor(private http: HttpClient) { }


  
  addseller(seller: any): Observable<any> {
    return this.http.post(this.sellerUrl, seller);
  }

  checksellerEmailExists(email: String): Observable<boolean>{
    return this.http.get<boolean[]>(`${this.sellerUrl}?email=${email}`)
    .pipe(
      // JSON Server returns an array, check if the array is not empty
      map((sellers: boolean[]) => sellers.length > 0)
    ); 
  }
}