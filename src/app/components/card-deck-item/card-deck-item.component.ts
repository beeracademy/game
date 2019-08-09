import { Component, OnInit, Input } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { CardsService } from 'src/app/services/cards.service';

@Component({
  selector: 'app-card-deck-item',
  templateUrl: './card-deck-item.component.html',
  styleUrls: ['./card-deck-item.component.scss']
})
export class CardDeckItemComponent implements OnInit {
  @Input() suit: string;
  @Input() value: number;

  public isDrawn = false;
  public image;

  constructor(public gameService: GameService, public cardsService: CardsService) {
  }

  ngOnInit() {
    this.image = this.suit + '-' + this.value + '.png';

    this.gameService.onCardDrawn.subscribe(this.updateIsDrawn.bind(this));

    this.updateIsDrawn();
  }

  private updateIsDrawn() {
    if (!this.isDrawn) {
      this.isDrawn = this.gameService.isCardDrawn(this.suit, this.value);
    }
  }
}
