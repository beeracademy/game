import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private soundpath = 'assets/sounds/';

  constructor() {
  }

  public play(soundName: string) {
    const audio = new Audio();
    audio.src = this.soundpath + soundName;

    audio.oncanplaythrough = () => {
      audio.play();
    };

    return audio;
  }
}
