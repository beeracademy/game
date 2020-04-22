import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { User } from '../models/user';
import { ChugModalComponent } from '../components/chug-modal/chug-modal.component';
import { FinishModalComponent } from '../components/finish-modal/finish-modal.component';
import { SpinnerModalComponent } from '../components/spinner-modal/spinner-modal.component';
import { Game } from '../models/game';
import { GameService } from '../services/game.service';
import { RetryUploadModalComponent } from '../components/retry-upload-modal/retry-upload-modal.component';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private sounds: SoundService) { }

  public showSnack(text: string) {
    this.sounds.play('snack');

    this.snackBar.open(text, null, {
      duration: 5000
    });
  }

  public showSpinner()  {
    return this.dialog.open(SpinnerModalComponent, {
      disableClose: true
    });
  }

  public openConfirm(text: string) {
    return this.dialog.open(ConfirmModalComponent, {
      disableClose: true,
      data: {
        text
      }
    }).afterClosed();
  }

  public openChug(gameService: GameService, user: User, chugs: number) {
    return this.dialog.open(ChugModalComponent, {
      disableClose: true,
      data: {
        gameService,
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
