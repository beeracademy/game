import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  public text: string;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.text = data.text;
  }

  ngOnInit() {
  }
}
