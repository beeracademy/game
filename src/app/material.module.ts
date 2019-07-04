import { NgModule } from '@angular/core';
import {MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule, MatDividerModule, MatSliderModule, MatDialogModule, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule} from '@angular/material';

const modules = [
  MatCardModule,
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatDividerModule,
  MatSliderModule,
  MatDialogModule,
  MatIconModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule
];

@NgModule({
  imports: modules,
  exports: modules,
})

export class MaterialModule { }
