import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit{

  
  registrationForm: FormGroup;
  



  constructor(private fb: FormBuilder, private sharedService: SharedService) {}
  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.registrationForm = this.fb.group({
      role: ['', Validators.required],
      firstName: [null, [Validators.pattern(/^[a-zA-Z\s']+$/)]],
      lastName: [null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      dob: [null, [Validators.required, this.ageValidator]],
      gender: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
      productcategories: [''],
      panNumber: ['']
    });

    this.registrationForm.get('productcategories').setValidators((group: FormGroup) => {
      if (this.registrationForm.get('role').value === 'seller') {
        return Validators.required(group);
      }
      return null;
    });
    


    this.sharedService.setFormData(this.registrationForm);
  }
    
  onDateInput(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
  const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
  this.registrationForm.get('dob').setValue(formattedDate);
  }

  private ageValidator(control: AbstractControl): { [key: string]: any } | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    const ageInYears = Math.floor((currentDate.getTime() - selectedDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    return ageInYears >= 14 ? null : { 'invalidAge': true };
  }

  
  }