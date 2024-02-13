import { ChangeDetectorRef, Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';



@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
 

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      console.log('Dialog Data:', this.data);
    }


    ngOnInit() {
      console.log('Loading value:', this.data.loading);
    }

    onYesClick(): void {
      this.data.loading = true; // Update the loading property
      // Perform your asynchronous operation here
      setTimeout(() => {
        this.data.loading = false; // Set it back to false when done
        this.dialogRef.close(true); // Close the dialog with a result
      }, 2000);
    }
  }