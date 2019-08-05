import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

  public matrix: any[][];

  private c = this.gameService.getNumberOfPlayers();
  private r = 13;

  constructor(public gameService: GameService, public usersService: UsersService) {
  }

  ngOnInit() {
    this.gameService.onCardDrawn.subscribe(() => {
      this.matrix = this.getMatrix();
    });

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
          m[i][j] = this.gameService.game.cards[cardIndex].value;
        }
      }
    }

    return m;
  }
}
