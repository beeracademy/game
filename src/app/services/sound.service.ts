import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private soundpath = 'assets/sounds/';
  private loops: {[soundName: string]: HTMLAudioElement} = {};

  constructor() {}

  public playLoop(soundName: string) {
    if (this.loops[soundName] === undefined) {
      const audio = this.loops[soundName] = this.play(soundName);
      audio.loop = true;
      // We might try to play audio at page load,
      // but this is rejected by modern browsers (no autoplay).
      // Work around this by starting the audio when the user clicks once.
      const click = () => {
        audio.play();
        window.removeEventListener('click', click);
      };
      window.addEventListener('click', click);
    } else {
      this.loops[soundName].play();
    }
  }

  public stopLoop(soundName: string) {
    const audio = this.loops[soundName];
    if (audio !== undefined) {
      audio.pause();
    }
  }

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
