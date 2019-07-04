import { Component, OnInit, Inject } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-new-user-modal',
  templateUrl: './create-new-user-modal.component.html',
  styleUrls: ['./create-new-user-modal.component.scss']
})
export class CreateNewUserModalComponent implements OnInit {

  public username: string;

  constructor(private dialogRef: MatDialogRef<CreateNewUserModalComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.username = data.username;
  }

  ngOnInit() {
  }

  public yes() {
    this.dialogRef.close(true);
  }

  public no() {
    this.dialogRef.close(false);
  }

}
