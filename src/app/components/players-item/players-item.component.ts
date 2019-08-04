import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { GameService } from 'src/app/services/game.service';
import { MetaService } from 'src/app/services/meta.service';
import { Card } from 'src/app/models/card';

@Component({
  selector: 'app-players-item',
  templateUrl: './players-item.component.html',
  styleUrls: ['./players-item.component.scss']
})
export class PlayersItemComponent implements OnInit {

  @Input() user: User;

  public moreInfo = false;
  public cards: Card[] = [];

  constructor(public gameService: GameService, public meta: MetaService) { }

  ngOnInit() {
    this.gameService.onCardDrawn.subscribe(() => {
      this.getCards();
    });

    this.getCards();
  }

  getCards() {
    this.cards = this.gameService.getCardsForPlayer(this.user);
  }

  isActive(): boolean {
    return this.gameService.getActiveIndex() === this.user.index && this.gameService.getCardsLeft() > 0;
  }

}
