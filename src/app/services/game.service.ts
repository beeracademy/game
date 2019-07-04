import { Injectable, Output, EventEmitter } from '@angular/core';
import { Game } from '../models/game';
import { SoundService } from './sound.service';
import { Router } from '@angular/router';
import { Card } from '../models/card';
import { ModalService } from './modal.service';
import { UsersService } from './users.service';
import { Chug } from '../models/chug';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  @Output() onCardDrawn: EventEmitter<any> = new EventEmitter();

  public game: Game;
  public isChugging = false;

  private roundStartTime: number;
  private draws = 0;

  constructor(
    private sounds: SoundService,
    private modal:ModalService,
    private usersService: UsersService,
    private router: Router) {
    this.game = new Game();
  }

  public start() {
    this.router.navigate(['game']);
    this.sounds.play('baladada.wav');

    this.game.startTime = (new Date()).getTime();
    this.roundStartTime = this.game.startTime;
  }

  public draw() {
    const playerIndex = this.getActiveIndex();

    const card = this.getRandomCard();
    this.draws++;

    this.checkForChug(card, playerIndex).subscribe(() => {
      this.game.cardsDrawn.push(card);

      if (this.getCardsLeft() <= 0) {
        this.finish();
      } else {
        this.roundStartTime = (new Date()).getTime();
      }

      // This needs to be done as the last thing!
      this.onCardDrawn.emit();
    });
  }

  public finish() {
    if(!this.game.endTime) {
      this.game.endTime = (new Date()).getTime();
      this.modal.openFinish(this.game.endTime - this.game.startTime).subscribe((result) => {
        if (result) {
          this.newGame();
        }
      });
    }
  }

  public newGame() {
    this.game = new Game();
    this.roundStartTime = 0;

    this.usersService.clearAll();

    this.router.navigate(['login']);
  }

  public getActiveIndex(): number {
    return this.game.cardsDrawn.length % this.game.playerCount;
  }

  public getCardsLeft(): number {
    return (13 * this.game.playerCount) - this.draws;
  }

  public getRound(): number {
    return Math.min(Math.floor((this.game.cardsDrawn.length / this.game.playerCount)) + 1, 13);
  }

  public getGameDuration() {
    return (new Date()).getTime() - this.game.startTime;
  }

  public getRoundDuration() {
    return (new Date()).getTime() - this.roundStartTime;
  }

  private getRandomCard(): Card {
    return new Card(14);
  }

  private checkForChug(card: Card, playerIndex: number): Observable<void> {
    return new Observable((obs) => {
      if (card.value === 14) {
        this.isChugging = true;

        this.modal.openChug(this.usersService.users[playerIndex].username).subscribe((res) => {
          this.game.chugs.push(new Chug(
            res,
            playerIndex,
          ));

          this.isChugging = false;

           obs.next();
        });
      } else {
        obs.next();
      }
    });
  }
}
