import { Component, OnInit, HostListener } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Space' && this.gameService.getRound() != 13 && !this.gameService.isChugging) {
      this.gameService.draw();
      event.preventDefault();
    }
  }

}
