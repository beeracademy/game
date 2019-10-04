import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { SoundService } from 'src/app/services/sound.service';
import { CardsService } from 'src/app/services/cards.service';
import { FlashService } from 'src/app/services/flash.service';
import { environment } from 'src/environments/environment';

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

  constructor(private gameService: GameService, private sound: SoundService, private cardsService: CardsService, private flashService: FlashService) {
    this.lastKeyPressTimeStamp = (new Date()).getTime();
  }

  ngOnInit() {
    this.intervalRef = setInterval(() => {
      if ((new Date()).getTime() - this.lastKeyPressTimeStamp > this.IDLTime ) {

        // Check if game is over
        if (this.gameService.getNumberOfCardsLeft() > 0) {
          this.playIDLSound();
        }
      }
    }, 1000);

    this.gameService.onCardDrawn.subscribe(() => {
      this.lastKeyPressTimeStamp = (new Date()).getTime();
    });

    // Change tab color to red
    document.querySelector('meta[name=theme-color]').setAttribute('content', '#ac181c');

    // Disable back button
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
  }

  @HostListener('window:beforeunload', ['$event'])
  reloadWarning($event) {
    if (environment.production) {
      return $event.returnValue = 'Game is active, do you want to reload?';
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Space' && !this.gameService.isChugging() && this.debounce()) {
      this.drawCard();

      event.preventDefault();
    }

    if (event.key === this.theDWord[this.theDProgress]) {
      this.theDProgress++;

      if (this.theDProgress >= this.theDWord.length) {
        this.cardsService.setDickMode(!this.cardsService.dickMode);
        this.theDProgress = 0;

        this.flashService.flashText('DICK MODE ' + (this.cardsService.dickMode ? 'ON' : 'OFF'));

        this.sound.play('click');

        if (this.cardsService.dickMode) {
          this.sound.play('dick');
        }
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
    this.sound.play('tryk_paa_den_lange_tast');
  }
}
