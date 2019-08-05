import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { ModalService } from 'src/app/services/modal.service';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { GameService } from 'src/app/services/game.service';

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

  private indicatorSuccess = '#2ecc71';
  private indicatorWaiting = '#f1c40f';
  private indicatorDenied  = '#e74c3c';

  constructor(
    private usersService: UsersService,
    private gameService: GameService,
    private modalService: ModalService,
    private snackBar: MatSnackBar) {
    this.indicatorColor = '#fff';
    this.disabled = false;
  }

  ngOnInit() {
  }

  public login(username: string, password: string) {
    if (!username || !password) {
      return;
    }

    this.indicatorColor = this.indicatorWaiting;
    this.disabled = true;

    this.usersService.login(username, password).subscribe((user: User) => {
        this.usersService.users.push(user);

        this.indicatorColor = this.indicatorSuccess;
        if (user.image) {
          this.image = environment.url + user.image;
        }
      },
      (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.modalService.openCreateNewUser(username, password).subscribe((result) => {
            if (result) {
              this.createNewUser(username, password);
            } else {
              this.resetIndicator();
            }
          });
        } else {
          this.resetIndicator();

          this.snackBar.open(this.parseFieldErrors(err.error), null, {
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
      this.snackBar.open(this.parseFieldErrors(err.error), null, {
        duration: 5000
      });

      this.resetIndicator();
    });
  }

  public resetIndicator() {
    this.indicatorColor = this.indicatorDenied;
    this.disabled = false;
  }

  public parseFieldErrors(json: any) {
    try {

      if (json.non_field_errors) {
        return json.non_field_errors.join('\n');
      }

      let res = '';

      for (const k in json) {
        if (json.hasOwnProperty(k)) {
          res += k + ': ' + json[k].join(' ') + ' ';
        }
      }

      return res.trim();
    } catch (e) {
      return 'Login failed';
    }
  }
}
