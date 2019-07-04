import { Component, OnInit, HostListener, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { UsersService } from '../../services/users.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-chug-modal',
  templateUrl: './chug-modal.component.html',
  styleUrls: ['./chug-modal.component.scss']
})
export class ChugModalComponent implements OnInit {

  public time = 0;
  public isRunning = false;

  public username: string;

  private startTime: number;
  private intervalRef: any;

  private pressureSound: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef:MatDialogRef<ChugModalComponent>,
    private sounds: SoundService,
    public users: UsersService) {
      this.username = data.username;
    }

  ngOnInit() {
    let chucks = 1; //Fix it: retreive from service

    switch (chucks) {
      case 1:
        this.sounds.play('mkd_finishim.wav');
        break;
      case 2:
        this.sounds.play('doublekill.wav');
        break;
      case 3:
        this.sounds.play('triplekill.wav');
        break;
      case 4:
        this.sounds.play('ultrakill.wav');
        break;
      case 5:
        this.sounds.play('megakill.wav');
        break;
      default:
        this.sounds.play('monsterkill.wav');
        break;
      }

      //this.pressureSound = this.sounds.play('pressure.webm');
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      this.isRunning ? this.stop() : this.start();
      event.preventDefault();
    }
  }

  start(){
    this.isRunning = true;
    this.startTime = (new Date()).getTime();

    this.intervalRef = setInterval(_ => {
      this.time = ((new Date()).getTime() - this.startTime);
    }, 1);
  }

  stop(){
    if(this.time > 500) {
      clearInterval(this.intervalRef);
      this.isRunning = false;
      this.playFinishSound();
      this.dialogRef.close(this.time);

      this.pressureSound.pause();
    }
  }

  formatString(ms: number): string {
    let res = '';

    res += ms;

    return res;
  }

  playFinishSound(){
    if(this.time < 5000) {
      this.sounds.play('mkd_flawless.wav');
    } else if(this.time < 7000) {
      this.sounds.play('mkd_fatality.wav');
    } else if(this.time < 20000) {
      this.sounds.play('mkd_laugh.wav');
    } else {
      this.sounds.play('humiliation.wav');
    }
  }
}
