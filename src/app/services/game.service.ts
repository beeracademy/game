import { Injectable, Output, EventEmitter } from '@angular/core';
import { Game } from '../models/game';
import { SoundService } from './sound.service';
import { Router } from '@angular/router';
import { Card } from '../models/card';
import { ModalService } from './modal.service';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CardsService } from './cards.service';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  @Output() onCardDrawn: EventEmitter<any> = new EventEmitter();

  public game: Game =  new Game();
  public deck: Card[] = [];

  public offline = false;

  constructor(
    private http: HttpClient,
    private sounds: SoundService,
    private modal: ModalService,
    private usersService: UsersService,
    private cardsService: CardsService,
    private router: Router) {
      this.resume();
  }

  public start() {
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

      this.save();

      this.router.navigate(['game']);
      this.sounds.play('baladada.wav');
    }));
  }

  public draw() {
    // Draw a card from the deck
    const draw = this.deck[this.game.cards.length];

    draw.drawn_datetime = (new Date()).toISOString();

    this.game.cards.push(draw);

    this.onCardDrawn.emit();
    this.postUpdate().subscribe({ error: e => {
      // NOOP
    }});

    // Check if ace or game done
    if (draw.value === 14) {
      this.showChugModal();
    } else if (this.getCardsLeft() <= 0) {
      this.endGame();
    }
  }

  private showChugModal() {
    const activePlayer = this.getActivePlayer();
    const playerAces = this.getAcesForPlayer(activePlayer);

    this.modal.openChug(activePlayer, playerAces.length).subscribe((duration) => {
      this.game.cards[this.game.cards.length - 1].chug_duration_ms = duration;

      this.postUpdate();

      // Check if the game is done
      if (this.getCardsLeft() <= 0) {
        this.endGame();
      }
    });
  }

  private endGame() {
    this.game.end_datetime = (new Date()).toISOString();
    this.save();

    this.showEndModal();
  }

  private showEndModal() {
    this.modal.openFinish(this.game).subscribe((description) => {
      this.game.description = description;
      this.save();

      this.postUpdate().subscribe(() => {
        localStorage.clear();
      }, error => {
        this.showRetryModal();
      });
    });
  }

  private showRetryModal() {
    this.modal.openRetryUpload(this.game).subscribe(() => {
      localStorage.clear();
    });
  }

  /*
    Requests
  */

  private postStart(): Observable<Game> {
    return this.http.post<Game>(`${environment.url}/api/games/`, {
      tokens: this.usersService.users.map(u => u.token),
      official: this.game.official
    });
  }

  private postUpdate(): Observable<any> {
    this.save();
    return this.http.post(`${environment.url}/api/games/` + this.game.id + '/update_state/', this.game);
  }

  /*
    Persistence
  */

  public save() {
    localStorage.setItem('academy:game', JSON.stringify(this.game));
    localStorage.setItem('academy:deck', JSON.stringify(this.deck));
    localStorage.setItem('academy:offline', JSON.stringify(this.offline));
  }

  public resume() {
    this.game = JSON.parse(localStorage.getItem('academy:game')) || this.game;
    this.deck = JSON.parse(localStorage.getItem('academy:deck')) || this.deck;
    this.offline = JSON.parse(localStorage.getItem('academy:offline')) || this.offline;

    // Check if chug modal should be open
    const latestCard = this.getLatestCard();
    if (this.game.cards.length > 0 && latestCard.value === 14 && !latestCard.chug_duration_ms) {
      this.showChugModal();
      return;
    }

    // Check if end game modal should be open
    if (this.getCardsLeft() <= 0 && this.game.start_datetime && !this.game.description) {
      this.showEndModal();
      return;
    }

    // Check if retry modal should be open
    if (this.getCardsLeft() <= 0 && this.game.end_datetime && this.game.description) {
      this.showRetryModal();
    }
  }

  /*
    Game meta
  */

  public getNumberOfPlayers(): number {
    return this.game.player_names.length;
  }

  public getActiveIndex(): number {
    if (this.isChugging()) {
      return (this.game.cards.length - 1) % this.getNumberOfPlayers();
    } else {
      return this.game.cards.length % this.getNumberOfPlayers();
    }
  }

  public getActivePlayer(): User {
    return this.usersService.users[this.getActiveIndex()];
  }

  public getCardsLeft(): number {
    return (13 * this.getNumberOfPlayers()) - this.game.cards.length;
  }

  public getRound(): number {
    return Math.min(Math.floor((this.game.cards.length / this.getNumberOfPlayers())) + 1, 13);
  }

  public getGameDuration(): number {
    if (this.game.end_datetime) {
      return (new Date(this.game.end_datetime)).getTime() - (new Date(this.game.start_datetime)).getTime();

    } else {
      return Date.now() - (new Date(this.game.start_datetime)).getTime();
    }
  }

  public getRoundDuration(): number {
    // Game is done
    if (this.getCardsLeft() === 0) {
      return (new Date(this.game.end_datetime).getTime()) - (new Date(this.getLatestCard().drawn_datetime)).getTime();
    } else {
      const latestCard = this.getLatestCard();
      const drawn_datetime = latestCard ? latestCard.drawn_datetime : this.game.start_datetime;

      return Date.now() - (new Date(drawn_datetime)).getTime();
    }
  }

  public getCardsForPlayer(player: User): Card[] {
    return this.game.cards.filter((_, i) => i % this.getNumberOfPlayers() === player.index);
  }

  public getAcesForPlayer(player: User): Card[] {
    return this.getCardsForPlayer(player).filter(c => c.value === 14);
  }

  public getLatestCard() {
    if (this.game.cards.length > 0) {
      return this.game.cards[this.game.cards.length - 1];
    }
  }

  public isChugging(): boolean {
    if (this.game.cards.length === 0) {
      return false;
    } else {
      const latestCard = this.game.cards[this.game.cards.length - 1];
      return latestCard.value === 14 && !latestCard.chug_duration_ms;
    }
  }

  public isCardDrawn(suit: string, value: number): boolean {
    return this.game.cards.filter(c => c.suit === suit && c.value === value).length > 0;
  }
}
