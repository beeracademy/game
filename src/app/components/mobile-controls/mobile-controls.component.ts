import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StatsModalComponent } from '../stats-modal/stats-modal.component';
import { SoundService } from 'src/app/services/sound.service';
import { MetaService } from 'src/app/services/meta.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-mobile-controls',
  templateUrl: './mobile-controls.component.html',
  styleUrls: ['./mobile-controls.component.scss']
})
export class MobileControlsComponent implements OnInit {

  public user: User;
  public beers: number;
  public sips: number;

  constructor(public gameService: GameService, public sounds: SoundService, public meta: MetaService, private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.gameService.onCardDrawn.subscribe(() => {
      this.update();
    });

    this.gameService.onChugDone.subscribe(() => {
      this.update();
    });

    this.update();
  }

  public update() {
    this.user = this.gameService.getActivePlayer();

    const cards = this.gameService.getCardsForPlayer(this.user);

    this.beers = this.meta.getBeers(cards);
    this.sips = this.meta.getSipsLeftInBeer(cards);
  }

  public draw() {
    if (!this.gameService.isChugging()) {
      this.gameService.draw();
    }
  }

  public stats() {
    this.bottomSheet.open(StatsModalComponent);
  }

  public exit() {
    window.location.reload();
  }
}
