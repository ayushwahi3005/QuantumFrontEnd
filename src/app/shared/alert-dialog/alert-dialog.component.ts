import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.css'
})
export class AlertDialogComponent {
    constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  close() {
    this.dialogRef.close();
  }
}
