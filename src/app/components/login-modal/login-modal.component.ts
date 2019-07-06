import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalService } from 'src/app/services/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  constructor(
    public gameService: GameService,
    public usersService: UsersService,
    private modal: ModalService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
  }

  public sliderChange(val) {
    console.log(val);
  }

  public startGame() {
    const ref = this.modal.showSpinner();

    ref.afterOpened().subscribe(()=> {
      this.gameService.start().subscribe((game) => {
        ref.close();
      }, (err: HttpErrorResponse) => {
        ref.close();

        this.snackBar.open('Failed to create game', null, {
          duration: 5000
        });
      });
    })

  }
}
