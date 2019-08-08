import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { User } from 'src/app/models/user';
import { GameService } from 'src/app/services/game.service';
import { MetaService } from 'src/app/services/meta.service';
import { Card } from 'src/app/models/card';
import { rubberBand } from 'ng-animate';
import { SoundService } from 'src/app/services/sound.service';
import { ModalService } from 'src/app/services/modal.service';
import { FlashService } from 'src/app/services/flash.service';

@Component({
  selector: 'app-players-item',
  templateUrl: './players-item.component.html',
  styleUrls: ['./players-item.component.scss'],
  animations: [
    trigger('crownAnimation', [transition(':enter', useAnimation(rubberBand))])
  ]
})
export class PlayersItemComponent implements OnInit {

  @Input() user: User;

  public cards: Card[] = [];

  public isLeading = false;

  constructor(public gameService: GameService, public meta: MetaService, private sounds: SoundService, private flashService: FlashService) { }

  ngOnInit() {
    this.gameService.onCardDrawn.subscribe(() => {
      this.getCards();
    });

    this.getCards();
  }

  getCards() {
    const isLeading = this.meta.getLeadingPlayer() === this.user.index && this.gameService.game.cards.length !== 0;

    if (!this.isLeading && isLeading && !(window as any).cold) {
      this.sounds.play('crown.mp3');
      this.flashService.flashText(this.user.username + ' in the lead!');
    }

    this.isLeading = isLeading;

    this.cards = this.gameService.getCardsForPlayer(this.user);
  }

  isActive(): boolean {
    return this.gameService.getActiveIndex() === this.user.index && this.gameService.getCardsLeft() > 0;
  }

}
