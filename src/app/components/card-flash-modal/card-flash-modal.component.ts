import { Component, OnInit } from '@angular/core';
import { zoomIn, zoomOut } from 'ng-animate';
import { useAnimation, transition, trigger } from '@angular/animations';
import { FlashService } from 'src/app/services/flash.service';

@Component({
  selector: 'app-card-flash-modal',
  templateUrl: './card-flash-modal.component.html',
  styleUrls: ['./card-flash-modal.component.scss'],
  animations: [
    trigger('animation', [
      transition(':enter', useAnimation( zoomIn, {
        params: { timing: 0.3 }
      })),
      transition(':leave', useAnimation( zoomOut, {
        params: { timing: 0.3 }
      }))
    ])
  ]
})
export class CardFlashModalComponent implements OnInit {
  public show = false;
  public cardURI: string;

  private timeout = null;

  constructor(public flashService: FlashService) { }

  ngOnInit() {
    this.flashService.onFlashCard.subscribe((card) => {
      if (this.timeout != null) {
        this.show = false;
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.cardURI =  'assets/cards/' + card.suit + '-' + card.value + '.png';
      this.show = true;

      this.timeout = setTimeout(() => {
        this.show = false;
      }, 1500);
    });
  }
}
