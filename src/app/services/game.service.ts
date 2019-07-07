import { Injectable, Output, EventEmitter } from '@angular/core';
import { Game } from '../models/game';
import { SoundService } from './sound.service';
import { Router } from '@angular/router';
import { Card } from '../models/card';
import { ModalService } from './modal.service';
import { UsersService } from './users.service';
import { Chug } from '../models/chug';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  @Output() onCardDrawn: EventEmitter<any> = new EventEmitter();

  public game: Game;
  public isChugging = false;
  public dickMode = false;

  private roundStartTime: number;
  private draws = 0;

  private drawnCards = {};

  constructor(
    private http: HttpClient,
    private sounds: SoundService,
    private modal:ModalService,
    private usersService: UsersService,
    private router: Router) {
    this.game = new Game();
  }

  public start() {
    return this.http.post(`${environment.url}/api/games/`, {
      tokens: this.usersService.users.map(u => u.token)
    }).pipe(map((game: Game) => {
        this.game.id = game.id;

        this.router.navigate(['game']);
        this.sounds.play('baladada.wav');

        this.game.startTime = (new Date()).getTime();
        this.roundStartTime = this.game.startTime;


        return game;
    }));
  }

  public draw() {
    const playerIndex = this.getActiveIndex();

    return this.http.post(`${environment.url}/api/games/` + this.game.id + '/draw_card/', null).pipe(map((card: Card) => {
      this.draws++;

      this.checkForChug(card, playerIndex).subscribe(() => {
        this.game.cardsDrawn.push(card);
        this.drawnCards[card.suit + card.value] = card;

        if (this.getCardsLeft() <= 0) {
          this.endGame();
        } else {
          this.roundStartTime = (new Date()).getTime();
        }

        // This needs to be done as the last thing!
        this.onCardDrawn.emit();
      });

      return card;
    }));
  }

    public endGame() {
    if(!this.game.endTime) {
      this.game.endTime = (new Date()).getTime();

      this.modal.openFinish(this.game.endTime - this.game.startTime).subscribe((description) => {
        this.http.post(`${environment.url}/api/games/` + this.game.id + '/end_game/', {
          description,
          end_datetime: new Date(this.game.endTime)
        }).subscribe(() => {
          // this.newGame();
        }, (err: HttpErrorResponse) => {
          // TODO
        });
      });
    }
  }

  public newGame() {
    this.game = new Game();
    this.draws = 0;
    this.isChugging = false;
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

  public isCardDrawn(suit: string, value: number) {
    return (suit + value) in this.drawnCards;
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

  private checkForChug(card: Card, playerIndex: number): Observable<void> {
    return new Observable((obs) => {
      if (card.value === 14) {
        this.isChugging = true;

        this.modal.openChug(this.usersService.users[playerIndex].username).subscribe((res) => {
          const newChug = new Chug(
            res,
            playerIndex,
          );

          this.game.chugs.push(newChug);

          this.isChugging = false;

          this.http.post(`${environment.url}/api/games/` + this.game.id + '/register_chug/', {
            duration_in_milliseconds: res
          }).subscribe(() => {
            obs.next();
          }, (err: HttpErrorResponse) => {
            // TODO
          });
        });
      } else {
        obs.next();
      }
    });
  }
}
