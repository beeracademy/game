import { Component, OnInit, HostListener } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalService } from 'src/app/services/modal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  public numberOfPlayers = 2;
  public shuffle = true;

  constructor(
    public gameService: GameService,
    public usersService: UsersService,
    private modal: ModalService
    ) {
      this.usersService.reset();
    }

  ngOnInit() {}

  public sliderChange(val) {
    this.usersService.users = this.usersService.users.slice(0, val);
  }

  public startGame() {
    const ref = this.modal.showSpinner();

    ref.afterOpened().subscribe(()=> {
      this.gameService.start().subscribe((game) => {
        this.usersService.save();
        ref.close();
      }, (err: HttpErrorResponse) => {
        ref.close();

        this.modal.showSnack('Failed to create game');
      });
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Space' || event.code === 'Enter') {
      if (this.numberOfPlayers === this.usersService.users.length) {
        this.startGame();
      }
    }
  }
}
