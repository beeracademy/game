import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { User } from 'src/app/models/user';
import { GameService } from 'src/app/services/game.service';
import { MetaService } from 'src/app/services/meta.service';
import { Card } from 'src/app/models/card';
import { bounceIn, bounceOut } from 'src/app/views/animations/bounce';

@Component({
  selector: 'app-players-item',
  templateUrl: './players-item.component.html',
  styleUrls: ['./players-item.component.scss'],
  animations: [
    trigger(
      'bounce', [
        transition(':enter', useAnimation(bounceIn)),
        transition(':leave', useAnimation(bounceOut)),

      ]
    )
  ]
})
export class PlayersItemComponent implements OnInit {

  @Input() user: User;

  public cards: Card[] = [];

  public isLeading = false;

  constructor(public gameService: GameService, public meta: MetaService) { }

  ngOnInit() {
    this.gameService.onCardDrawn.subscribe(() => {
      this.getCards();
    });

    this.getCards();
  }

  getCards() {
    this.isLeading = this.meta.getLeadingPlayer() === this.user.index && this.gameService.game.cards.length !== 0;
    this.cards = this.gameService.getCardsForPlayer(this.user);
  }

  isActive(): boolean {
    return this.gameService.getActiveIndex() === this.user.index && this.gameService.getCardsLeft() > 0;
  }

}
