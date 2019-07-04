import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

  constructor(public gameService: GameService, public usersService: UsersService) { }

  ngOnInit() {
  }

}
