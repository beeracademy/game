import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-card-deck',
  templateUrl: './card-deck.component.html',
  styleUrls: ['./card-deck.component.scss']
})
export class CardDeckComponent implements OnInit {

  public suits: string[] = ['S', 'C', 'H', 'D', 'A', 'I'];
  public cards: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  constructor(private gameService: GameService) {
    this.suits = this.suits.slice(0, this.gameService.game.playerCount);
  }

  ngOnInit() {
  }

}
