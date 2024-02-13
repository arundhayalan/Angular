import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { BuyerService } from '../../services/buyer.service';



@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  
  indiaStates: string[] = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
  checkoutForm: FormGroup;
  showSaveAddressCheckbox: boolean = false;
  savedAddresses: any[] = [];
  buyerId: any;
  selectedAddressId: string | null = null;
  apiUrl = 'http://localhost:3000/buyer-addresses';

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private authService: AuthService, private buyerService: BuyerService, private router: Router) { 

    this.checkoutForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      address: [null, Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required], // Add validators as needed
      pincode: [null, Validators.required], // Add validators as needed
      phonenumber: [null, Validators.required], // Add validators as needed
      addressSave: [false]
    });
  }


  ngOnInit() {
    this.checkoutForm.get('country').valueChanges.subscribe((country) => {
      if (country === 'india') {
        this.checkoutForm.get('state').setValidators([Validators.required]);
      } else {
        this.checkoutForm.get('state').clearValidators();
      }
      this.checkoutForm.get('state').updateValueAndValidity();
    });

    // Fetch saved addresses based on the logged-in buyer's ID from AuthService
    this. buyerId = this.authService.getLoggedInUserId();
    console.log(this.buyerId);
    this.fetchSavedAddresses(this.buyerId);
    

      this.loadSavedAddresses();
     
  }

  

  loadSavedAddresses(): void {
    // Assuming you have a method in your service to retrieve addresses based on buyerId
   // Replace with actual buyerId from your authentication system
    console.log(this.buyerId);
    this.buyerService.getAddressesByBuyerId(this.buyerId).subscribe((addresses: any[]) => {
      this.savedAddresses = addresses;
      console.log(this.savedAddresses);
    });

    
  }
  onAddAddress(): void {
    // Logic to navigate to the add address page or display a modal
    this.showSaveAddressCheckbox = true;
  }

  onSelectSavedAddress(address: any) {
    // Assuming that the server provides an 'id' field for each address
    this.selectedAddressId = address.id;

    // Fetch the complete address details from the server using the addressId
    this.http.get<any>(`${this.apiUrl}/${this.selectedAddressId}`).subscribe(
      (completeAddress) => {
        // Update the form with the fetched address details
        this.checkoutForm.patchValue({
          name: completeAddress.name,
          email: completeAddress.email,
          address: completeAddress.address,
          country: completeAddress.country,
          state: completeAddress.state,
          pincode: completeAddress.pincode,
          phonenumber: completeAddress.phonenumber,
          addressSave: false ,
          buyerId: completeAddress.buyerId// Assuming 'addressSave' is the correct control name
        });
      },
      (error) => {
        console.error('Error fetching address details:', error);
      }
    );

    this.showSaveAddressCheckbox = true;
  }

  
  onSubmit() {
    const loggedInBuyerId = this.authService.getLoggedInUserId();
    const formData = this.checkoutForm.value;

    if (formData.addressSave && this.selectedAddressId===null) {
      // Add new address
      this.http.post(this.apiUrl, { buyerId: loggedInBuyerId, ...formData }).subscribe(
        () => {
          this.fetchSavedAddresses(loggedInBuyerId);
          alert("Order Confirmed"); // Refresh saved addresses
          this.router.navigate(['/buyers/list-of-products']);
        },
        (error) => {
          console.error('Error adding new address:', error);
        }
      );
    } else if (this.selectedAddressId) {
      // Update existing address using the selectedAddressId
      const updatedFormData = { ...formData, buyerId: loggedInBuyerId };
      this.http.put(`${this.apiUrl}/${this.selectedAddressId}`, updatedFormData).subscribe(
        () => {
          this.fetchSavedAddresses(loggedInBuyerId);
          alert("Order Confirmed");
          this.router.navigate(['/buyers/list-of-products']);
            // Refresh saved addresses
        },
        (error) => {
          console.error('Error updating address:', error);
        }
      );
    } else {
      // Handle the case where selectedAddressId is not present
      console.error('Error: selectedAddressId is required for updating an existing address.');
    }
  }

  
  fetchSavedAddresses(buyerId: string): void {
    this.http.get<any[]>(`${this.apiUrl}?buyerId=${buyerId}`).subscribe(
      (addresses) => {
        this.savedAddresses = addresses;
      },
      (error) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }
}