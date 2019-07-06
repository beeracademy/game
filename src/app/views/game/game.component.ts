import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { SoundService } from 'src/app/services/sound.service';
import { Card } from 'src/app/models/card';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  private lastKeyPressTimeStamp: number;
  private IDLTime = 1000 * 60 * 15; // Every 15 min

  private intervalRef;

  constructor(private gameService: GameService, private sound: SoundService, private snackBar: MatSnackBar) {
    this.lastKeyPressTimeStamp = (new Date()).getTime();
  }

  ngOnInit() {
    this.intervalRef = setInterval(() => {
      if ((new Date()).getTime() - this.lastKeyPressTimeStamp > this.IDLTime ) {
        this.playIDLSound();
      }
    }, 1000);

    this.gameService.onCardDrawn.subscribe(() => {
      this.lastKeyPressTimeStamp = (new Date()).getTime();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Space' && this.gameService.getCardsLeft() !== 0 && !this.gameService.isChugging) {
      this.gameService.draw().subscribe(() => {}, (err: HttpErrorResponse) => {
        this.snackBar.open('Failed to draw card', null, {
          duration: 5000
        });
      });

      event.preventDefault();
    }
  }

  playIDLSound() {
    this.lastKeyPressTimeStamp = (new Date()).getTime();
    this.sound.play('tryk_paa_den_lange_tast.wav');
  }
}
