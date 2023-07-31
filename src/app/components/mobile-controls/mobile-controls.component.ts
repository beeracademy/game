import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { StatsModalComponent } from "../stats-modal/stats-modal.component";
import { SoundService } from "src/app/services/sound.service";
import { MetaService } from "src/app/services/meta.service";
import { User } from "src/app/models/user";

@Component({
  selector: "app-mobile-controls",
  templateUrl: "./mobile-controls.component.html",
  styleUrls: ["./mobile-controls.component.scss"],
})
export class MobileControlsComponent implements OnInit {
  public user: User;
  public total_sips: string;
  private simple_sips: boolean;

  constructor(
    public gameService: GameService,
    public sounds: SoundService,
    public meta: MetaService,
    private bottomSheet: MatBottomSheet
  ) {
    this.simple_sips = false;
  }

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
    const sips = this.meta.getSipsLeftInBeer(cards);

    this.total_sips = this.simple_sips ? 
                        this.meta.getTotalSips(cards) + "<sub>14</sub>" 
                        : `${sips} sip${sips > 1 ? "s" : ""} left in beer ${this.meta.getBeers(cards) + 1}`;
  }

  public toggleSips() {
    this.simple_sips = !this.simple_sips;
    this.update();
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
