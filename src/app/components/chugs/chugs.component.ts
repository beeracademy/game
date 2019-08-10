import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-chugs',
  templateUrl: './chugs.component.html',
  styleUrls: ['./chugs.component.scss']
})
export class ChugsComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit() {
  }

}
