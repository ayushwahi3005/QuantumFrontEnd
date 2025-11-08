import { CommonModule } from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle, MatDialogModule } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.css',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule,MatFormFieldModule],
})
export class DialogueComponent {
  readonly dialogRef = inject(MatDialogRef<DialogueComponent>);
  
    dismiss(): void {
      this.dialogRef.close();
    }
}
