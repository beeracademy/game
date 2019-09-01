import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Game } from 'src/app/models/game';

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
    private dialogRef: MatDialogRef<FinishModalComponent>) {
    const game: Game = this.data.game;

    this.description = game.description;
    this.duration = new Date(game.end_datetime).getTime() - new Date(game.start_datetime).getTime();
  }

  ngOnInit() {
  }

  public done() {
    this.dialogRef.close(this.description);
  }
}
