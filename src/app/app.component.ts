import { Component, OnInit } from "@angular/core";
import { GameService } from "./services/game.service";
import { Router } from "@angular/router";
import { UsersService } from "./services/users.service";
import { ASSETS } from "./assets";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Beeracademy Game";

  private preload(src: string) {
    const parts = src.split(".");
    const extension = parts[parts.length - 1];
    if (extension === "ogg" || extension === "mp3") {
      const audio = new Audio();
      audio.src = src;
      audio.preload = "auto";
    } else {
      const image = new Image();
      image.src = src;
    }
  }

  private preloadAssets() {
    for (const src of ASSETS) {
      this.preload(src);
    }
  }

  constructor(
    private router: Router,
    private gameService: GameService,
    private userService: UsersService
  ) {
    this.preloadAssets();
    if (
      this.gameService.game.start_datetime &&
      this.userService.users.length > 0
    ) {
      this.router.navigate(["game"]);
    } else {
      this.gameService.clearSavedGame();
    }

    setTimeout(() => {
      (window as any).cold = false;
    }, 500);
  }
}
