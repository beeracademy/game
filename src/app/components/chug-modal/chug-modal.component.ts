import { Component, OnInit, HostListener, Inject, OnDestroy, Injector} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { UsersService } from '../../services/users.service';
import { SoundService } from 'src/app/services/sound.service';
import { User } from 'src/app/models/user';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-chug-modal',
  templateUrl: './chug-modal.component.html',
  styleUrls: ['./chug-modal.component.scss']
})
export class ChugModalComponent implements OnInit, OnDestroy {

  public time = 0;
  public isRunning = false;

  public user: User;
  public chugs: number;

  private startTime: number;
  private intervalRef: any;

  private modal;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ChugModalComponent>,
    private sounds: SoundService,
    public users: UsersService) {
      this.user = data.user;
      this.chugs = data.chugs;
    }

  ngOnInit() {
    if ((window as any).cold) {
      return;
    }

    switch (this.chugs) {
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
      case 6:
        this.sounds.play('monsterkill.wav');
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'Space') {
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

  stop() {
    if(this.time > 200) {
      clearInterval(this.intervalRef);
      this.isRunning = false;
      this.playFinishSound();
      this.dialogRef.close(this.time);
    }
  }

  formatString(ms: number): string {
    let res = '';

    res += ms;

    return res;
  }

  playFinishSound(){
    if (this.time < 5000) {
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
