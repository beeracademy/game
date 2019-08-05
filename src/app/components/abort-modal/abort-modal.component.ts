import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-abort-modal',
  templateUrl: './abort-modal.component.html',
  styleUrls: ['./abort-modal.component.scss']
})
export class AbortModalComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AbortModalComponent>) {}

  ngOnInit() {
  }

  public yes() {
    this.dialogRef.close(true);
  }

  public no() {
    this.dialogRef.close(false);
  }
}
