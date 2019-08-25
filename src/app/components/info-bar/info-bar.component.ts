import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { ModalService } from 'src/app/services/modal.service';
import { Router } from '@angular/router';
import { SoundService } from 'src/app/services/sound.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent implements OnInit, OnDestroy {

  public duration = 0;
  public roundDuration = 0;

  private intervalRef;

  constructor(public gameService: GameService, public modal: ModalService, private sounds: SoundService) {
  }

  ngOnInit() {
    this.intervalRef = setInterval(this.updateTime.bind(this), 1000);

    this.gameService.onCardDrawn.subscribe(_ => {
      this.updateTime();
    });

    this.updateTime();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
  }

  private updateTime() {
      this.duration = this.gameService.getGameDuration();
      this.roundDuration = this.gameService.getRoundDuration();
  }

  public abort() {
    this.modal.openConfirm('Are you sure you want to quit the game?').subscribe((result) => {
      if (result) {
        this.modal.showSpinner();
        this.sounds.play('loser');

        setTimeout(() => {
          localStorage.clear();
          window.location.reload();

        }, 3500);
      }
    });
  }

  public goToGame() {
    window.location.href = environment.url + '/games/' + this.gameService.game.id + '/';
  }
}
