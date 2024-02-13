// shared/shared.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private formDataSubject: BehaviorSubject<FormGroup | null> = new BehaviorSubject<FormGroup | null>(null);
  formData$: Observable<FormGroup | null> = this.formDataSubject.asObservable();

  setFormData(formData: FormGroup) {
    this.formDataSubject.next(formData);
  }
}