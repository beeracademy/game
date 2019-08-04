import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateNewUserModalComponent } from '../components/create-new-user-modal/create-new-user-modal.component';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { ChugModalComponent } from '../components/chug-modal/chug-modal.component';
import { FinishModalComponent } from '../components/finish-modal/finish-modal.component';
import { SpinnerModalComponent } from '../components/spinner-modal/spinner-modal.component';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog, private userService: UsersService) { }

  public showSpinner()  {
    return this.dialog.open(SpinnerModalComponent, {
      disableClose: true
    });
  }

  public openCreateNewUser(username: string, password: string) {
    return this.dialog.open(CreateNewUserModalComponent, {
      disableClose: true,
      data: {
        username
      }
    }).afterClosed();
  }

  public openChug(user: User, chugs: number) {
    return this.dialog.open(ChugModalComponent, {
      disableClose: true,
      data: {
        user,
        chugs
      }
    }).afterClosed();
  }

  public openFinish(game: Game) {
    return this.dialog.open(FinishModalComponent, {
      disableClose: true,
      data: {
        game
      }
    }).afterClosed();
  }
}
