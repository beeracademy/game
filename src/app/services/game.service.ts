import { Injectable, Output, EventEmitter } from '@angular/core';
import { Game, getStartDeltaMs } from '../models/game';
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
import { Chug } from '../models/chug';
import { RetryUploadModalComponent } from '../components/retry-upload-modal/retry-upload-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FlashService } from './flash.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  @Output() onCardDrawn: EventEmitter<Card> = new EventEmitter();
  @Output() onChugDone: EventEmitter<Card> = new EventEmitter();

  public game: Game =  new Game();
  public deck: Card[] = [];

  public offline = false;

  constructor(
    private http: HttpClient,
    private sounds: SoundService,
    private modal: ModalService,
    private usersService: UsersService,
    private cardsService: CardsService,
    private flashService: FlashService,
    private router: Router,
    private dialog: MatDialog) {
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
      this.sounds.play('baladada');
    }));
  }

  public draw() {
    if (this.getNumberOfCardsLeft() === 0) {
      return;
    }

    // Draw a card from the deck
    const draw = this.deck[this.game.cards.length];

    draw.start_delta_ms = getStartDeltaMs(this.game);

    this.game.cards.push(draw);

    this.onCardDrawn.emit(draw);
    this.postUpdate().subscribe({ error: e => {
      // NOOP
    }});

    // Check if ace or game done
    if (draw.value === 14) {
      this.showChugModal();
    } else if (this.getNumberOfCardsLeft() <= 0) {
      this.endGame();
    }
  }

  private showChugModal() {
    const activePlayer = this.getActivePlayer();
    const playerAces = this.getAcesForPlayer(activePlayer);

    this.flashService.flashCard(null);

    this.modal.openChug(this.game, activePlayer, playerAces.length).subscribe(data => {
      const c = this.getLatestCard();
      c.chug_start_start_delta_ms = data.start_ms;
      c.chug_end_start_delta_ms = data.end_ms;

      this.postUpdate().subscribe(() => {});

      this.onChugDone.emit();

      // Check if the game is done
      if (this.getNumberOfCardsLeft() <= 0) {
        this.endGame();
      }
    });
  }

  private endGame() {
    this.game.has_ended = true;
    this.save();

    this.showEndModal();
  }

  public abort() {
    this.modal.openConfirm('Are you sure you want to quit the game?').subscribe((result) => {
      if (result) {
        const spinner = this.modal.showSpinner();
        this.sounds.play('loser');

        setTimeout(() => {
          this.resetAndGoToLogin();
          spinner.close();
        }, 3500);
      }
    });
  }

  public resetAndGoToLogin() {
    localStorage.clear();
    this.reset();
    this.usersService.reset();
    this.router.navigate(['login']);
  }

  public reset() {
    this.game = new Game();
    this.deck = [];
    this.offline = false;
  }

  private showEndModal() {
    this.modal.openFinish(this.game).subscribe((description) => {
      this.game.description = description;
      this.save();

      const spinner = this.modal.showSpinner();

      this.postUpdate().subscribe(() => {
        localStorage.clear();
        spinner.close();
      }, error => {
        spinner.close();
        this.showRetryModal();
      });
    });
  }

  private showRetryModal() {
    this.dialog.open(RetryUploadModalComponent, {
      disableClose: true,
      data: {
        game: this.game
      }
    }).afterClosed().subscribe(() => {
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
    if (this.game.cards.length > 0 && latestCard.value === 14 && !latestCard.chug_start_start_delta_ms) {
      this.showChugModal();
      return;
    }

    // Check if end game modal should be open
    if (this.getNumberOfCardsLeft() <= 0 && this.game.start_datetime && !this.game.description) {
      this.showEndModal();
      return;
    }

    // Check if retry modal should be open
    if (this.getNumberOfCardsLeft() <= 0 && this.game.has_ended && this.game.description) {
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

  public getNumberOfCardsLeft(): number {
    return (13 * this.getNumberOfPlayers()) - this.game.cards.length;
  }

  public getCardsLeft(): Card[] {
    return this.deck.slice(this.game.cards.length, this.deck.length);
  }

  public getDrawsLeftForPlayer(user: User) {
    return 13 - this.getCardsForPlayer(user).length;
  }

  public getRound(): number {
    return Math.min(Math.floor((this.game.cards.length / this.getNumberOfPlayers())) + 1, 13);
  }

  public getGameDuration(): number {
    if (this.game.has_ended) {
      const c = this.getLatestCard();
      if (c.chug_end_start_delta_ms) {
        return c.chug_end_start_delta_ms;
      } else {
        return c.start_delta_ms;
      }
    } else {
      return Date.now() - (new Date(this.game.start_datetime)).getTime();
    }
  }

  public getTurnDuration(): number {
    // Game is done
    if (this.getNumberOfCardsLeft() === 0) {
      return 0;
    } else {
      const latestCard = this.getLatestCard();
      const latest_start_delta_ms = latestCard ? latestCard.start_delta_ms : 0;
      return getStartDeltaMs(this.game) - latest_start_delta_ms;
    }
  }

  public getCardsForPlayer(player: User): Card[] {
    return this.game.cards.filter((_, i) => i % this.getNumberOfPlayers() === player.index);
  }

  public getAcesForPlayer(player: User): Card[] {
    return this.getCardsForPlayer(player).filter(c => c.value === 14);
  }

  public getChugs(): Chug[] {
    const chugs = [];

    for (let i = 0; i < this.game.cards.length; i++) {
      if (this.game.cards[i].value === 14) {
        chugs.push(new Chug(
          this.usersService.users[i % this.getNumberOfPlayers()],
          this.game.cards[i]
        ));
      }
    }

    return chugs;
  }

  public getLatestCard(): Card {
    if (this.game.cards.length > 0) {
      return this.game.cards[this.game.cards.length - 1];
    }
  }

  public isChugging(): boolean {
    if (this.game.cards.length === 0) {
      return false;
    } else {
      const latestCard = this.game.cards[this.game.cards.length - 1];
      return latestCard.value === 14 && !latestCard.chug_end_start_delta_ms;
    }
  }

  public isCardDrawn(suit: string, value: number): boolean {
    return this.game.cards.filter(c => c.suit === suit && c.value === value).length > 0;
  }
}
