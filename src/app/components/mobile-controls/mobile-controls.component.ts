import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { MatBottomSheet } from '@angular/material';
import { StatsModalComponent } from '../stats-modal/stats-modal.component';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-mobile-controls',
  templateUrl: './mobile-controls.component.html',
  styleUrls: ['./mobile-controls.component.scss']
})
export class MobileControlsComponent implements OnInit {

  constructor(public gameService: GameService, public sounds: SoundService, private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
  }

  public draw() {
    if (!this.gameService.isChugging()) {
      this.gameService.draw();
    }
  }

  public stats() {
    this.bottomSheet.open(StatsModalComponent);
  }
}
