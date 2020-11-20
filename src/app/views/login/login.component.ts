import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(private gameService: GameService) {}

  ngOnInit() {
    document
      .querySelector("meta[name=theme-color]")
      .setAttribute("content", "#fff");
    this.gameService.clearSavedGame();
  }
}
