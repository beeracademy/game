import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { SoundService } from 'src/app/services/sound.service';
import { CardsService } from 'src/app/services/cards.service';
import { FlashService } from 'src/app/services/flash.service';
import { environment } from 'src/environments/environment';
import { Card } from 'src/app/models/card';
import { Game } from 'src/app/models/game';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  private lastKeyPressTimeStamp: number;
  private IDLTime = 1000 * 60 * 15; // Every 15 min

  private debounceTime = 200;

  private intervalRef;

  private disableDraw = false;

  private game: Game;

  constructor(
    private gameService: GameService,
    private sound: SoundService,
    private cardsService: CardsService,
    private flashService: FlashService,
    private modalService: ModalService,
    private userService: UsersService

  ) {
    this.lastKeyPressTimeStamp = new Date().getTime();
    this.game = this.gameService.game;
  }

  ngOnInit() {
    this.intervalRef = setInterval(() => {
      if (new Date().getTime() - this.lastKeyPressTimeStamp > this.IDLTime) {
        // Check if game is over
        if (!this.gameService.isGameDone()) {
          this.playIDLSound();
        }
      }
    }, 1000);

    this.gameService.onCardDrawn.subscribe((card: Card) => {
      if (card.value !== 14 && this.gameService.getNumberOfCardsLeft() !== 0) {
        this.flashService.flashCard(card);
      }

      this.lastKeyPressTimeStamp = new Date().getTime();
    });

    this.gameService.onChugDone.subscribe((card: Card) => {
      this.lastKeyPressTimeStamp = new Date().getTime();
    });

    // Change tab color to red
    document
      .querySelector('meta[name=theme-color]')
      .setAttribute('content', '#ac181c');

    // Disable back button
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
      history.go(1);
    };

    // Commands
    this.registerCommand('itsnotadick', this.itsNotADick.bind(this));
    this.registerCommand('yee', this.importantVideos.bind(this));
    this.registerCommand('idhair', this.idhair.bind(this));
    this.registerCommand('extrachug?', this.extraChug.bind(this));
    this.registerCommand('downunder', this.flipBody.bind(this));
    this.registerCommand('olderenneger', this.oldErEnNeger.bind(this));
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (
      event.code === 'Space' &&
      !this.gameService.isChugging() &&
      this.debounce()
    ) {
      this.drawCard();

      event.preventDefault();
    }
  }

  registerCommand(word: string, callback: (string) => void) {
    let progess = 0;
    let cmd = '';

    document.body.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === word[progess] || word[progess] === '?') {
        if (word[progess] === '?') {
          cmd += event.key;
        }

        progess++;

        if (progess >= word.length) {
          callback(cmd);
          progess = 0;
          cmd = '';
        }
      } else {
        progess = 0;
      }
    });
  }

  debounce(): boolean {
    return (
      new Date().getTime() - this.lastKeyPressTimeStamp > this.debounceTime
    );
  }

  drawCard() {
    if (this.disableDraw) {
      return;
    }

    this.gameService.draw();
  }

  // Funny stuff

  extraChug(cmd: string) {
    const i = parseInt(cmd, 10);
    if (0 <= i && i < this.userService.users.length) {
      this.disableDraw = true;
      this.modalService.openChug(this.gameService, this.userService.users[i], 9001).subscribe(() => {
        this.disableDraw = false;
      });
    }
  }

  itsNotADick() {
    this.cardsService.setDickMode(!this.cardsService.dickMode);
    this.flashService.flashText(
      'DICK MODE ' + (this.cardsService.dickMode ? 'ON' : 'OFF')
    );
    this.sound.play('click');

    if (this.cardsService.dickMode) {
      this.sound.play('dick');
    }
  }

  importantVideos() {
    this.flashService.flashText('yee...');
    setTimeout(() => {
      window.open(
        'https://www.youtube.com/watch?v=q6EoRBvdVPQ&list=PLFsQleAWXsj_4yDeebiIADdH5FMayBiJo',
        '_blank'
      );
    }, 1000);
  }

  idhair() {
    window.open('https://www.youtube.com/watch?v=iL5_7Pey4xE', '_blank');
  }

  flipBody() {
    if (document.body.classList.contains('flip')) {
      this.flashService.flashText('Take it easy!');
      document.body.classList.remove('flip');
    } else {
      this.flashService.flashText('G\'day mate!');
      document.body.classList.add('flip');
    }
  }

  oldErEnNeger() {
    if (document.body.classList.contains('black')) {
      document.body.classList.remove('black');
    } else {
      this.flashService.flashText('Negerland');
      this.sound.play('old');
      document.body.classList.add('black');
    }
  }

  playIDLSound() {
    this.lastKeyPressTimeStamp = new Date().getTime();
    this.sound.play('tryk_paa_den_lange_tast');
  }
}
