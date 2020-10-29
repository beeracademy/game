import { Component, OnInit, Input } from "@angular/core";
import { trigger, transition, useAnimation } from "@angular/animations";
import { User } from "src/app/models/user";
import { GameService } from "src/app/services/game.service";
import { MetaService } from "src/app/services/meta.service";
import { Card } from "src/app/models/card";
import { rubberBand } from "ng-animate";
import { UsersService } from "src/app/services/users.service";
import { SoundService } from "src/app/services/sound.service";
import { ModalService } from "src/app/services/modal.service";
import { FlashService } from "src/app/services/flash.service";

@Component({
  selector: "app-players-item",
  templateUrl: "./players-item.component.html",
  styleUrls: ["./players-item.component.scss"],
  animations: [
    trigger("crownAnimation", [transition(":enter", useAnimation(rubberBand))]),
  ],
})
export class PlayersItemComponent implements OnInit {
  @Input() user: User;
  @Input() mute = false;

  public cards: Card[] = [];

  public indicatorHeight = 0;
  public indicatorTransition = "1s height";

  private lastInLeadStr = "";

  constructor(
    public gameService: GameService,
    public meta: MetaService,
    private sounds: SoundService,
    private flashService: FlashService,
    public usersService: UsersService
  ) {}

  ngOnInit() {
    this.gameService.onCardDrawn.subscribe(() => {
      this.updateCards();
      this.updateBeerPercentage();
      if (this.user.index === 0) {
        this.showLeadingFlash();
      }
    });

    this.updateCards();
    this.updateBeerPercentage();
  }

  updateCards() {
    this.cards = this.gameService.getCardsForPlayer(this.user);
  }

  showLeadingFlash() {
    const currentInLead = [];
    for (let i = 0; i < this.gameService.getNumberOfPlayers(); i++) {
      if (this.meta.isLeadingPlayer(i)) {
        currentInLead.push(this.usersService.users[i].username);
      }
    }
    const currentInLeadStr = currentInLead.join(", ");

    if (currentInLeadStr !== this.lastInLeadStr && !(window as any).cold) {
      if (!this.mute) {
        this.sounds.play("crown");
      }
      this.flashService.flashText(currentInLeadStr + " in the lead!");
    }

    this.lastInLeadStr = currentInLeadStr;
  }

  // This method is unholy and should be disregarded
  updateBeerPercentage() {
    const per = 100 - this.meta.getPercentageLeftInBeer(this.cards);

    if (per < this.indicatorHeight) {
      this.indicatorTransition = "none";
      setTimeout(() => {
        this.indicatorHeight = 0;
        setTimeout(() => {
          this.indicatorTransition = "1s height";
          setTimeout(() => {
            this.indicatorHeight = per;
          }, 100);
        }, 100);
      }, 100);
    } else {
      this.indicatorHeight = per;
    }
  }

  isActive(): boolean {
    return (
      this.gameService.getActiveIndex() === this.user.index &&
      !this.gameService.isGameDone()
    );
  }

  isLeading(): boolean {
    return (
      this.meta.isLeadingPlayer(this.user.index) &&
      this.gameService.game.cards.length !== 0
    );
  }

  isDNF(): boolean {
    return this.gameService.isDNF(this.user);
  }

  toggleDNF() {
    this.gameService.toggleDNF(this.user);
  }
}
