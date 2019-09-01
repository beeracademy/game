import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-stats-modal',
  templateUrl: './stats-modal.component.html',
  styleUrls: ['./stats-modal.component.scss']
})
export class StatsModalComponent implements OnInit {

  constructor(public gameService: GameService, public usersService: UsersService) { }

  ngOnInit() {
  }

}
