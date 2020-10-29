import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import * as Card from "src/app/models/card";

@Component({
  selector: "app-card-deck",
  templateUrl: "./card-deck.component.html",
  styleUrls: ["./card-deck.component.scss"],
})
export class CardDeckComponent implements OnInit {
  public suits: string[] = Card.suits;
  public values: number[] = Card.values;

  constructor(private gameService: GameService) {
    this.suits = this.suits.slice(0, this.gameService.game.player_names.length);
  }

  ngOnInit() {}
}
