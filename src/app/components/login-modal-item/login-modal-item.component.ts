import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { ModalService } from 'src/app/services/modal.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login-modal-item',
  templateUrl: './login-modal-item.component.html',
  styleUrls: ['./login-modal-item.component.scss']
})
export class LoginModalItemComponent implements OnInit {

  @Input() index: number;

  public image: string;
  public indicatorColor: string;
  public disabled: boolean;

  private indicatorSuccess: string = '#2ecc71';
  private indicatorWaiting: string = '#f1c40f';
  private indicatorDenied: string = '#e74c3c';

  constructor(private usersService: UsersService, private modalService: ModalService, private snackBar: MatSnackBar, private http: HttpClient) {
    this.indicatorColor = '#fff';
    this.disabled = false;
  }

  ngOnInit() {
  }

  public login(username: string, password: string) {
    this.indicatorColor = this.indicatorWaiting;
    this.disabled = true;

    this.usersService.login(username, password).subscribe(
      (user: User) => {
        this.indicatorColor = this.indicatorSuccess;
      },
      (err1: HttpErrorResponse) => {
        if (err1.status === 404) {
          this.modalService.openCreateNewUser(username, password).subscribe(() => {
            this.createNewUser(username, password);
          }, (err2: HttpErrorResponse) => {
            this.resetIndicator();
            this.snackBar.open('Failed to authenticate ' + username, null, {
              duration: 5000
            });
          });
        } else {
          this.resetIndicator();
          this.snackBar.open('Failed to authenticate ' + username, null, {
            duration: 5000
          });
        }
      }
    );
  }

  public createNewUser(username: string, password: string) {
    this.usersService.create(username, password).subscribe((result) => {
      this.login(username, password);
    }, (err: HttpErrorResponse) => {
      this.resetIndicator();
      this.snackBar.open('Failed to create user ' + username, null, {
        duration: 5000
      });
    });
  }

  public resetIndicator() {
    this.indicatorColor = this.indicatorDenied;
    this.disabled = false;
  }
}
