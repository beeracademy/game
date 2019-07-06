import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-finish-modal',
  templateUrl: './finish-modal.component.html',
  styleUrls: ['./finish-modal.component.scss']
})
export class FinishModalComponent implements OnInit {

  public duration: number;
  public description = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef:MatDialogRef<FinishModalComponent>) {
    this.duration = this.data.duration;
  }

  ngOnInit() {
  }

  public done() {
    this.dialogRef.close(this.description);
  }
}
