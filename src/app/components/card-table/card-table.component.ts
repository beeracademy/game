import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';
import { CardsService } from 'src/app/services/cards.service';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

  public matrix: any[][];

  private c = this.gameService.getNumberOfPlayers();
  private r = 13;

  public playerInTurn = 0;
  public round = 0;

  constructor(public gameService: GameService, public usersService: UsersService, public cardsService: CardsService) {
  }

  ngOnInit() {
    this.gameService.onCardDrawn.subscribe(this.update.bind(this));
    this.update();
  }

  update() {
    this.playerInTurn = this.gameService.game.cards.length % this.gameService.getNumberOfPlayers();
    this.round = this.gameService.getRound();
    this.matrix = this.getMatrix();
  }

  getMatrix() {
    const m = [];

    for (let i = 0; i < this.r; i++) {
      m[i] = [];
      for (let j = 0; j < this.c; j++) {

        const cardIndex = this.c * i + j;

        if (this.gameService.game.cards.length < cardIndex + 1) {
          m[i][j] = ' ';
        } else {
          const card = this.gameService.game.cards[cardIndex];
          m[i][j] = card;
        }
      }
    }

    return m;
  }
}
