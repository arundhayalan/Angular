import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { SellerDirective } from './shared/seller.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Retailify';
  constructor(private translateService: TranslateService, private authService: AuthService) {
    // English as the default language
    this.translateService.setDefaultLang('en');
  }
  ngOnInit(): void {
    // Check authentication status on app initialization
    if(!this.authService.isLoggedIn())
    {
      localStorage.setItem('userRole', 'guest');
    }
    
    
  }

  
}