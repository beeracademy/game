import { Component, OnInit, HostListener, Inject, OnDestroy, Injector} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { SoundService } from 'src/app/services/sound.service';
import { User } from 'src/app/models/user';
import { FlashService } from 'src/app/services/flash.service';
import { StatsService , UserStats} from 'src/app/services/stats.service';

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
  private bestChug: number;
  private bestChugSeason: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public users: UsersService,
    private dialogRef: MatDialogRef<ChugModalComponent>,
    private sounds: SoundService,
    private statsService: StatsService,
    private flashService: FlashService) {
      this.user = data.user;
      this.chugs = data.chugs;
    }

  ngOnInit() {
    this.statsService.GetUserStats(this.user.id).subscribe(res => {
      if (res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          const t = res[i].fastest_chug_duration_ms;
          if (!this.bestChug || t < this.bestChug) {
            this.bestChug = t;
            this.bestChugSeason = res[i].season_number;
          }
        }
      }
    });

    if ((window as any).cold) {
      return;
    }


    switch (this.chugs) {
      case 1:
        this.flashService.flashText('FINISH HIM!');
        this.sounds.play('mkd_finishim');
        break;
      case 2:
        this.flashService.flashText('DOUBLE KILL!');
        this.sounds.play('doublekill');
        break;
      case 3:
        this.flashService.flashText('TRIPLE KILL!');
        this.sounds.play('triplekill');
        break;
      case 4:
        this.flashService.flashText('ULTRA KILL!');
        this.sounds.play('ultrakill');
        break;
      case 5:
        this.flashService.flashText('MEGA KILL!');
        this.sounds.play('megakill');
        break;
      case 6:
        this.flashService.flashText('MONSTER KILL!');
        this.sounds.play('monsterkill');
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

  start() {
    this.isRunning = true;
    this.startTime = (new Date()).getTime();

    this.intervalRef = setInterval(_ => {
      this.time = ((new Date()).getTime() - this.startTime);
    }, 1);
  }

  stop() {
    if (this.time > 200) {
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

  playFinishSound() {
    if (this.time < 5000) {
      this.flashService.flashText('FlAWLESS VICTORY!');
      this.sounds.play('mkd_flawless');
    } else if (this.time < 7000) {
      this.flashService.flashText('FATALITY!');
      this.sounds.play('mkd_fatality');
    } else if (this.time < 20000) {
      this.sounds.play('mkd_laugh');
    } else {
      this.sounds.play('humiliation');
    }
  }
}
