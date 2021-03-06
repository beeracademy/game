import { Component, OnInit, OnDestroy } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { ModalService } from "src/app/services/modal.service";
import { Router } from "@angular/router";
import { SoundService } from "src/app/services/sound.service";
import { environment } from "src/environments/environment";
import { GIT_COMMIT_HASH } from "src/app/generated";

@Component({
  selector: "app-info-bar",
  templateUrl: "./info-bar.component.html",
  styleUrls: ["./info-bar.component.scss"],
})
export class InfoBarComponent implements OnInit, OnDestroy {
  public duration = 0;
  public turnDuration = 0;
  public GIT_COMMIT_HASH = GIT_COMMIT_HASH;

  private intervalRef;

  constructor(
    public gameService: GameService,
    public modal: ModalService,
    private sounds: SoundService
  ) {}

  ngOnInit() {
    this.intervalRef = setInterval(this.updateTime.bind(this), 1000);

    this.gameService.onCardDrawn.subscribe((_) => {
      this.updateTime();
    });

    this.updateTime();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalRef);
  }

  private updateTime() {
    this.duration = this.gameService.getGameDuration();
    this.turnDuration = this.gameService.getTurnDuration();
  }

  public abort() {
    this.gameService.abort();
  }

  public goToGame() {
    window.location.href =
      environment.url + "/games/" + this.gameService.game.id + "/";
  }

  public restart() {
    this.gameService.resetAndGoToLogin();
  }
}
