import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { CreateNewUserModalComponent } from '../components/create-new-user-modal/create-new-user-modal.component';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { ChugModalComponent } from '../components/chug-modal/chug-modal.component';
import { FinishModalComponent } from '../components/finish-modal/finish-modal.component';
import { SpinnerModalComponent } from '../components/spinner-modal/spinner-modal.component';
import { Game } from '../models/game';
import { RetryUploadModalComponent } from '../components/retry-upload-modal/retry-upload-modal.component';
import { AbortModalComponent } from '../components/abort-modal/abort-modal.component';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  @Output() onFlashText: EventEmitter<string> = new EventEmitter();

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private sounds: SoundService) { }

  public showSnack(text: string) {
    this.sounds.play('snack.mp3');

    this.snackBar.open(text, null, {
      duration: 5000
    });
  }

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

  public openRetryUpload(game: Game) {
    return this.dialog.open(RetryUploadModalComponent, {
      disableClose: true,
      data: {
        game
      }
    }).afterClosed();
  }

  public openAbort() {
    return this.dialog.open(AbortModalComponent, {
      disableClose: true
    }).afterClosed();
  }

  public flashText(text: string) {
    setTimeout(() => {
      this.onFlashText.emit(text);
    }, 0);
  }
}
