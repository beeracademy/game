import { Component, OnInit, Input } from "@angular/core";
import { CardsService } from "src/app/services/cards.service";
import { Chug } from "src/app/models/chug";

@Component({
  selector: "app-chugs-item",
  templateUrl: "./chugs-item.component.html",
  styleUrls: ["./chugs-item.component.scss"],
})
export class ChugsItemComponent implements OnInit {
  @Input() chug: Chug;

  public duration = 0;
  public symbol = "";
  public color = "";
  public username = "";

  constructor(private cardsService: CardsService) {}

  ngOnInit() {
    const card = this.chug.card;
    this.duration =
      card.chug_end_start_delta_ms - card.chug_start_start_delta_ms;
    this.symbol = this.cardsService.getSymbol(card);
    this.color = this.cardsService.getColor(card);
    this.username = this.chug.user.username;
  }
}
