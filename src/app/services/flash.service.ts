import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlashService {

  @Output() onFlashText: EventEmitter<string> = new EventEmitter();

  constructor() { }

  public flashText(text: string) {
    setTimeout(() => {
      this.onFlashText.emit(text);
    }, 0);
  }
}
