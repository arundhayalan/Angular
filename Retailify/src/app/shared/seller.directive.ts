import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appSeller]'
})
export class SellerDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService // Inject your authentication service
  ) {}

  @Input() set appSeller(role: string) {

    this.authService.userRole$.subscribe((userRole) => {
      if (userRole === role) {
        console.log(userRole);
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
    
  }