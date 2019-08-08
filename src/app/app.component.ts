import { Component, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { Router } from '@angular/router';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Beeracademy Game';

  constructor(private router: Router, private gameService: GameService, private userService: UsersService) {
    if (this.gameService.game.start_datetime && this.userService.users.length > 0) {
      this.router.navigate(['game']);
    } else {
      localStorage.clear();
    }

    setTimeout(() => {
      (window as any).cold = false;
    }, 500);
  }
}
