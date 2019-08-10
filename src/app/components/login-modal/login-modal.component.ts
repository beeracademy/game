import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { UsersService } from 'src/app/services/users.service';
import { ModalService } from 'src/app/services/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {
  public numberOfPlayers = 2;

  public readyPlayers: boolean[] = [];
  public isReady = false;

  public isShuffling = false;
  private shuffleTimeTotal = 3000;
  private shuffleEvery = 200;

  constructor(
    public gameService: GameService,
    public usersService: UsersService,
    private modal: ModalService,
    private soundService: SoundService,
    private changeDetectorRef: ChangeDetectorRef) {
      this.usersService.reset();
    }

  ngOnInit() {
    this.usersService.setNumberOfUsers(this.numberOfPlayers);
  }

  public sliderChange(val) {
    this.readyPlayers = this.readyPlayers.slice(0, val);
    this.updateIsReady();

    this.usersService.setNumberOfUsers(val);
  }

  public startGame() {
    const ref = this.modal.showSpinner();

    this.gameService.start().subscribe((game) => {
      this.usersService.save();
      ref.close();
    }, (err: HttpErrorResponse) => {
      ref.close();
      this.modal.showSnack('Failed to create game');
    });
  }

  public ready(index: number) {
    this.readyPlayers[index] = true;
    this.updateIsReady();
  }

  public updateIsReady() {
    for (let i = 0; i < this.numberOfPlayers; i++) {
      if (!this.readyPlayers[i]) {
        this.readyPlayers[i] = false;
      }
    }

    this.isReady = this.readyPlayers.reduce((a, b) => a && b, true);
  }

  public shuffle() {
    this.isShuffling = true;

    const sound = this.soundService.play('slot_machine.mp3');

    const interval = setInterval(() => {
      this.usersService.assignPlayerIndexes(true);
    }, this.shuffleEvery);

    setTimeout(() => {
      clearInterval(interval);
      sound.pause();
      this.soundService.play('slot_machine_winner.mp3');
      this.isShuffling = false;
    }, this.shuffleTimeTotal);
  }
}
