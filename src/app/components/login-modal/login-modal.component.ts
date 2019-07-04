import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  constructor(public gameService: GameService, public usersService: UsersService, private modal:ModalService) { }

  ngOnInit() {
  }

  startGame() {
    this.gameService.start();
  }
}
