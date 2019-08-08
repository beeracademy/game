import { Component, OnInit, ChangeDetectorRef, SimpleChange } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { fadeOut, rubberBand } from 'ng-animate';
import { useAnimation, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-text-flash-modal',
  templateUrl: './text-flash-modal.component.html',
  styleUrls: ['./text-flash-modal.component.scss'],
  animations: [
    trigger('animation', [
      transition(':enter', useAnimation( rubberBand, {
        params: { timing: 0.5 }
      })),
      transition(':leave', useAnimation( fadeOut, {
        params: { timing: 0.3 }
      }))
    ])
  ]
})
export class TextFlashModalComponent implements OnInit {

  public show = false;
  public text = '';

  constructor(public modal: ModalService) { }

  ngOnInit() {
    this.modal.onFlashText.subscribe((text) => {
      console.log(text);

      this.text = text;
      this.show = true;

      setTimeout(() => {
        this.show = false;
      }, 1000);
    });
  }
}
