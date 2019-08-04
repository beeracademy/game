import { Injectable, Output, EventEmitter } from '@angular/core';
import { Game } from '../models/game';
import { SoundService } from './sound.service';
import { Router } from '@angular/router';
import { Card } from '../models/card';
import { ModalService } from './modal.service';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CardsService } from './cards.service';
import { User } from '../models/user';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  @Output() onCardDrawn: EventEmitter<any> = new EventEmitter();

  public game: Game;
  public deck: Card[];

  public offline = false;

  public dickMode = false;

  constructor(
    private http: HttpClient,
    private sounds: SoundService,
    private modal: ModalService,
    private usersService: UsersService,
    private cardsService: CardsService,
    private router: Router) {
    this.game = new Game();
  }

  public start(): Observable<void> {
    // Check if game already started
    if (this.game.start_datetime) {
      return;
    }

    // Fill in user ids and names
    this.game.player_ids = this.usersService.users.map(u => u.id);
    this.game.player_names = this.usersService.users.map(u => u.username);

    // Generate seed and deck
    this.game.seed = this.cardsService.generateSeedForPlayers(this.getNumberOfPlayers());
    this.deck = this.cardsService.generateCardsFromSeed(this.getNumberOfPlayers(), this.game.seed);

    // Tell the server we are starting
    return this.postStart().pipe(map((game: Game) => {
      this.game.id = game.id;
      this.game.start_datetime = game.start_datetime;

      this.router.navigate(['game']);
      this.sounds.play('baladada.wav');
    }));
  }

  public draw() {
    // Draw a card from the deck
    const draw = this.deck[this.game.draws.length];
    draw.drawn_datetime = Date.now();
    this.game.draws.push(draw);

    this.onCardDrawn.emit();
    this.postUpdate();

    // Check if ace
    if (draw.value === 14) {
      const activePlayer = this.getActivePlayer();
      const playerAces = this.getAcesForPlayer(activePlayer);

      this.modal.openChug(this.getActivePlayer(), playerAces.length).subscribe((duration) => {
        this.game.draws[this.game.draws.length - 1].chug_duration = duration;

        // Check if the game is done
        if (this.getCardsLeft() <= 0) {
          this.endGame();
        }
      });

    } else if (this.getCardsLeft() <= 0) {
      this.endGame();
    }
  }

  private endGame() {
    if (this.game.end_datetime) {
      return;
    }

    this.game.end_datetime = Date.now();

    this.modal.openFinish(this.game).subscribe((description) => {
      this.game.description = description;
      this.postUpdate();
      this.localClear();
    });
  }

  /*
    Requests
  */

  private postStart(): Observable<Game> {
    this.localSave();
    return this.http.post<Game>(`${environment.url}/api/games/`, {
      tokens: this.usersService.users.map(u => u.token)
    });
  }

  private postUpdate(): Observable<any> {
    this.localSave();
    return this.http.post(`${environment.url}/api/games/` + this.game.id + '/update/', this.game);
  }

  /*
    Local storage
  */

  public localSave() {
    localStorage.setItem('academy:game', JSON.stringify(this.game));
    localStorage.setItem('academy:users', JSON.stringify(this.usersService.users));
  }

  public localLoad() {
    this.game = JSON.parse(localStorage.getItem('academy:game'));
    this.usersService.users = JSON.parse(localStorage.getItem('academy:users'));
  }

  public localClear() {
    localStorage.clear();
  }

  public hasLocalActiveGame() {
    return !!localStorage.getItem('academy:game') && !!localStorage.getItem('academy:users') ;
  }

  /*
    Game meta
  */

  public getNumberOfPlayers(): number {
    return this.game.player_names.length;
  }

  public getActiveIndex(): number {
   return this.game.draws.length % this.getNumberOfPlayers();
  }

  public getActivePlayer(): User {
    return this.usersService.users[this.getActiveIndex()];
  }

  public getCardsLeft(): number {
    return (13 * this.getNumberOfPlayers()) - this.game.draws.length;
  }

  public getRound(): number {
    return Math.min(Math.floor((this.game.draws.length / this.getNumberOfPlayers())) + 1, 13);
  }

  public getGameDuration(): number {
    return Date.now() - this.game.start_datetime;
  }

  public getRoundDuration(): number {
    return Date.now() - this.game.draws[this.game.draws.length - 1].drawn_datetime;
  }

  public getCardsForPlayer(player: User): Card[] {
    return this.game.draws.filter((_, i) => i % this.getNumberOfPlayers() === player.index);
  }

  public getAcesForPlayer(player: User): Card[] {
    return this.getCardsForPlayer(player).filter(c => c.value === 14);
  }

  public isChugging(): boolean {
    const latestCard = this.game.draws[this.game.draws.length - 1];
    return latestCard.value === 14 && !latestCard.chug_duration;
  }

  public isCardDrawn(suit: string, value: number): boolean {
    return this.game.draws.filter(c => c.suit === suit && c.value === value).length > 0;
  }
}
