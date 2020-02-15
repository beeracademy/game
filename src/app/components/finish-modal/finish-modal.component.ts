import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Game } from 'src/app/models/game';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-finish-modal',
  templateUrl: './finish-modal.component.html',
  styleUrls: ['./finish-modal.component.scss']
})
export class FinishModalComponent implements OnInit {

  public duration: number;
  public description: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FinishModalComponent>,
    private sounds: SoundService) {
    const game: Game = this.data.game;

    this.description = game.description;
    this.duration = new Date(game.end_datetime).getTime() - new Date(game.start_datetime).getTime();

    this.sounds.play('cheering');
  }

  ngOnInit() {
  }

  public done() {
    this.dialogRef.close(this.description);
  }
}
