import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent implements OnInit {

  public duration = 0;
  public roundDuration = 0;

  constructor(public gameService: GameService) {
  }

  ngOnInit() {
    setInterval(this.updateTime.bind(this), 1000);

    this.gameService.onCardDrawn.subscribe(_ => {
      this.updateTime();
    });
  }

  private updateTime() {
    if (!this.gameService.game.endTime) {
      this.duration = this.gameService.getGameDuration();
      this.roundDuration = this.gameService.getRoundDuration();
    }
  }

}
