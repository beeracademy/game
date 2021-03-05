import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { StorageService } from "src/app/services/storage.service";
import { GameService } from "src/app/services/game.service";
import { UsersService } from "src/app/services/users.service";
import { TimeService } from "src/app/services/time.service";
import { ModalService } from "src/app/services/modal.service";
import { HttpErrorResponse } from "@angular/common/http";
import { SoundService } from "src/app/services/sound.service";

@Component({
  selector: "app-login-modal",
  templateUrl: "./login-modal.component.html",
  styleUrls: ["./login-modal.component.scss"],
})
export class LoginModalComponent implements OnInit {
  public numberOfPlayers = 4;

  public readyPlayers: boolean[] = [];
  public isReady = false;

  public shuffleDone = false;
  public isShuffling = false;
  public isMuted = false;
  private shuffleTimeTotal = 3000;
  private shuffleEvery = 200;

  constructor(
    private storageService: StorageService,
    public gameService: GameService,
    public usersService: UsersService,
    private timeService: TimeService,
    private modal: ModalService,
    private soundService: SoundService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.usersService.reset();
  }

  ngOnInit() {
    this.usersService.setNumberOfUsers(this.numberOfPlayers);

    this.soundService.playLoop("homosangen_fuve");
    if (this.storageService.get("muteLobby", false)) {
      this.soundService.toggleMute("homosangen_fuve");
      this.isMuted = true;
    }

    this.timeService.approxServerTimeDifference().subscribe((diff) => {
      const absDiff = Math.abs(diff);
      if (absDiff > 10 * 1000) {
        const diffStr = `${Math.floor(absDiff / 1000)} seconds ${
          diff > 0 ? "ahead" : "behind"
        }`;
        this.modal.openAlert(
          `Your clock seems to be ${diffStr} of the server's. To avoid issues, please synchronize your clock.`
        );
      }
    });

    const elms = document.getElementsByTagName("input");

    document.body.addEventListener("keydown", (e: any) => {
      if (e.target.tagName !== "INPUT") {
        return;
      }

      if (e.keyCode !== 13) {
        return;
      }

      const a = Array.from(elms);
      const i = a.indexOf(e.target);

      if (i === a.length) {
        return;
      }

      const next = a[i + 1];

      if (next.type !== "text" && next.type !== "password") {
        e.target.blur();
        return;
      }

      next.focus();

      e.preventDefault();
    });
  }

  public sliderChange(val) {
    this.readyPlayers = this.readyPlayers.slice(0, val);
    this.updateIsReady();

    this.usersService.setNumberOfUsers(val);
  }

  public startGame() {
    const ref = this.modal.showSpinner();

    this.gameService.start().subscribe(
      (game) => {
        this.soundService.stopLoop("homosangen_fuve");
        this.usersService.save();
        ref.close();
      },
      (err: HttpErrorResponse) => {
        ref.close();
        this.modal.showSnack("Failed to create game");
        console.error(err);
      }
    );
  }

  public ready(index: number) {
    this.readyPlayers[index] = true;
    this.updateIsReady();
  }

  public notReady(index: number) {
    this.readyPlayers[index] = false;
    this.updateIsReady();
  }

  public updateIsReady() {
    for (let i = 0; i < this.numberOfPlayers; i++) {
      if (!this.readyPlayers[i]) {
        this.readyPlayers[i] = false;
      }
    }

    this.isReady = this.readyPlayers.reduce((a, b) => a && b, true);
  }

  public shuffle() {
    this.isShuffling = true;

    const sound = this.soundService.play("slot_machine");

    const interval = setInterval(() => {
      this.usersService.assignPlayerIndexes(true);
    }, this.shuffleEvery);

    setTimeout(() => {
      clearInterval(interval);
      sound.pause();
      this.soundService.play("slot_machine_winner");
      this.isShuffling = false;
      this.shuffleDone = true;
    }, this.shuffleTimeTotal);
  }

  public toggleMute() {
    this.soundService.toggleMute("homosangen_fuve");
    this.isMuted = !this.isMuted;
    this.storageService.set("muteLobby", this.isMuted);
  }
}
