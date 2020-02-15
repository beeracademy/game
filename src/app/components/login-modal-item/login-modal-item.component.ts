import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { ModalService } from 'src/app/services/modal.service';
import { environment } from 'src/environments/environment';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-login-modal-item',
  templateUrl: './login-modal-item.component.html',
  styleUrls: ['./login-modal-item.component.scss']
})
export class LoginModalItemComponent implements OnInit {

  @ViewChild('password') passwordField: ElementRef;

  @Input() index: number;
  @Input() locked: number;
  @Output() ready = new EventEmitter<void>();
  @Output() notReady = new EventEmitter<void>();

  public indicatorColor: string;
  public disabled: boolean;

  public envUrl = environment.url;

  private indicatorSuccess = '#2ecc71';
  private indicatorWaiting = '#f1c40f';
  private indicatorDenied  = '#e74c3c';

  constructor(
    public gameService: GameService,
    public usersService: UsersService,
    private modalService: ModalService) {
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
        this.indicatorColor = this.indicatorSuccess;
        user.index = this.index;

        Object.assign(this.usersService.users[this.index], user);

        this.ready.emit();
      },
      (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.modalService.openConfirm('Create new user ' + username + '?').subscribe((result) => {
            if (result) {
              this.createNewUser(username, password);
            } else {
              this.resetIndicator();
            }
          });
        } else {
          this.resetIndicator();

          this.modalService.showSnack(this.parseFieldErrors(err.error));
        }
      }
    );
  }

  public createNewUser(username: string, password: string) {
    this.usersService.create(username, password).subscribe((result) => {
      this.login(username, password);
    }, (err: HttpErrorResponse) => {
      this.modalService.showSnack(this.parseFieldErrors(err.error));

      this.resetIndicator();
    });
  }

  public resetLogin() {
    if (this.locked) {
      return;
    }

    Object.assign(this.usersService.users[this.index], new User());
    this.notReady.emit();
    this.indicatorColor = '';
    this.disabled = false;
    this.passwordField.nativeElement.value = '';
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
