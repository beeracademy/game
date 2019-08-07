import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  private lastKeyPressTimeStamp: number;
  private IDLTime = 1000 * 60 * 15; // Every 15 min

  private debounceTime = 200;

  private theDWord = 'itsnotadick';
  private theDProgress = 0;

  private intervalRef;

  constructor(private gameService: GameService, private sound: SoundService) {
    this.lastKeyPressTimeStamp = (new Date()).getTime();
  }

  ngOnInit() {
    this.intervalRef = setInterval(() => {
      if ((new Date()).getTime() - this.lastKeyPressTimeStamp > this.IDLTime ) {

        // Check if game is over
        if (this.gameService.getCardsLeft() > 0) {
          this.playIDLSound();
        }
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
    if (event.code === 'Space' && this.gameService.getCardsLeft() !== 0 && !this.gameService.isChugging() && this.debounce()) {
      this.drawCard();

      event.preventDefault();
    }

    if (event.key === this.theDWord[this.theDProgress]) {
      this.theDProgress++;

      if (this.theDProgress >= this.theDWord.length) {
        this.gameService.dickMode = true;
      }
    } else {
      this.theDProgress = 0;
    }
  }

  debounce(): boolean {
    return (new Date()).getTime() - this.lastKeyPressTimeStamp > this.debounceTime;
  }

  drawCard() {
    this.gameService.draw();
  }

  playIDLSound() {
    this.lastKeyPressTimeStamp = (new Date()).getTime();
    this.sound.play('tryk_paa_den_lange_tast.wav');
  }
}
