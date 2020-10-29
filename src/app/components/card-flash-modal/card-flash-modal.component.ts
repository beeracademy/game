import { Component, OnInit } from "@angular/core";
import { zoomIn, zoomOut } from "ng-animate";
import { useAnimation, transition, trigger } from "@angular/animations";
import { FlashService } from "src/app/services/flash.service";
import { StatsService, RankedCard } from "src/app/services/stats.service";

@Component({
  selector: "app-card-flash-modal",
  templateUrl: "./card-flash-modal.component.html",
  styleUrls: ["./card-flash-modal.component.scss"],
  animations: [
    trigger("animation", [
      transition(
        ":enter",
        useAnimation(zoomIn, {
          params: { timing: 0.3 },
        })
      ),
      transition(
        ":leave",
        useAnimation(zoomOut, {
          params: { timing: 0.3 },
        })
      ),
    ]),
  ],
})
export class CardFlashModalComponent implements OnInit {
  public show = false;
  public cardURI: string;
  public rankedPhoto: string;
  public rankedCards: { [card_name: string]: RankedCard };

  private timeout = null;

  constructor(
    public flashService: FlashService,
    private statsService: StatsService
  ) {}

  private preloadImage(src: string) {
    const image = new Image();
    image.src = src;
  }

  ngOnInit() {
    this.statsService.GetRankedCards().subscribe((cards) => {
      this.rankedCards = cards;

      for (const card of Object.values(cards)) {
        this.preloadImage(card.user_image);
      }

      this.flashService.onFlashCard.subscribe((card) => {
        if (!card) {
          this.clear();
          return;
        }

        if (this.timeout != null) {
          this.clear();
        }

        const cardName = card.suit + "-" + card.value;

        if (cardName in this.rankedCards) {
          this.rankedPhoto = this.rankedCards[cardName].user_image;
        } else {
          this.rankedPhoto = null;
        }

        this.cardURI = "assets/cards/" + cardName + ".png";
        this.show = true;

        this.timeout = setTimeout(() => {
          this.show = false;
          this.rankedPhoto = null;
        }, 1500);
      });
    });
  }

  clear() {
    this.show = false;
    clearTimeout(this.timeout);
    this.timeout = null;
  }
}
