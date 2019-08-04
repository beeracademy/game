import { Component, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { UsersService } from './services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Beeracademy Game';

  constructor(private router: Router, private gameService: GameService, private usersService: UsersService) {

    /*
    if (gameService.hasLocalActiveGame()) {
      gameService.localLoad();
      this.router.navigate(['game']);
    } else {
      gameService.localClear();
    }
    */
  }
}
