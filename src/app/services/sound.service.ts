import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private soundpath = 'assets/sounds/';

  constructor() {}

  public play(soundName: string) {
    const audio = new Audio();

    if (audio.canPlayType('audio/ogg;codecs=vorbis') !== '') {
      // play ogg
      audio.src = this.soundpath + soundName + '.ogg';
    } else {
      // mp3 fallback
      audio.src = this.soundpath + soundName + '.mp3';
    }

    audio.oncanplaythrough = () => {
      audio.play();
    };

    return audio;
  }
}
