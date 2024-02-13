import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from '../user.model';



@Injectable({
  providedIn: 'root'
})
export class BuyerService {

  private usersUrl = 'http://localhost:3000/buyers';

  private apiUrl = 'http://localhost:3000/buyer-addresses';

  
  
  constructor(private http: HttpClient) {}

  login(): Observable<User[]> {
    console.log(this.http.get<User[]>(`${this.usersUrl}`));
    return this.http.get<User[]>(`${this.usersUrl}`);
  }
  addBuyer(user: any): Observable<any> {
    return this.http.post(this.usersUrl, user);
  }
  
  getAddressesByBuyerId(buyerId: string): Observable<any[]> {
    const url = `${this.apiUrl}?buyerId=${buyerId}`;

    return this.http.get<any[]>(url);
  }

  updateAddress(addressId: any, requestData: any): Observable<any> {
    const url = `${this.apiUrl}/${addressId}`;
    return this.http.patch(`${this.apiUrl}/${addressId}`, requestData)
  }
  
  

  checkEmailExists(email: String): Observable<boolean>{
    return this.http.get<boolean[]>(`${this.usersUrl}?email=${email}`)
    .pipe(
      // JSON Server returns an array, check if the array is not empty
      map((buyers: boolean[]) => buyers.length > 0)
    ); 
  }
}