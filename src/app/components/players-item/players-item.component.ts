import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-players-item',
  templateUrl: './players-item.component.html',
  styleUrls: ['./players-item.component.scss']
})
export class PlayersItemComponent implements OnInit {

  @Input() user: User;

  constructor(public gameService: GameService) { }

  ngOnInit() {
  }

  isActive(): boolean {
    return this.gameService.getActiveIndex() === this.user.index && this.gameService.getCardsLeft() > 0;
  }

}
