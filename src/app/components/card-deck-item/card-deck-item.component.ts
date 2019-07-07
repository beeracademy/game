import { Component, OnInit, Input } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-card-deck-item',
  templateUrl: './card-deck-item.component.html',
  styleUrls: ['./card-deck-item.component.scss']
})
export class CardDeckItemComponent implements OnInit {
  @Input() suit: string;
  @Input() value: number;

  public image = '';

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.gameService.onCardDrawn.subscribe(this.setImage.bind(this));
    this.setImage();
  }

  setImage() {
    if (this.gameService.isCardDrawn(this.suit, this.value)) {
      this.image = 'assets/cards/' + (this.gameService.dickMode ? 'cardback-au.png' : 'cardback.png');
    } else {
      this.image = 'assets/cards/' + this.suit + '-' + this.value + '.png';
    }
  }

}
