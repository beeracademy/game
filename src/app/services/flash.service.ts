import { Injectable, EventEmitter, Output } from "@angular/core";
import { Card } from "../models/card";

@Injectable({
  providedIn: "root",
})
export class FlashService {
  @Output() onFlashText: EventEmitter<string> = new EventEmitter();
  @Output() onFlashCard: EventEmitter<Card> = new EventEmitter();

  constructor() {}

  public flashText(text: string) {
    setTimeout(() => {
      this.onFlashText.emit(text);
    }, 0);
  }

  public flashCard(card: Card) {
    setTimeout(() => {
      this.onFlashCard.emit(card);
    }, 0);
  }
}
