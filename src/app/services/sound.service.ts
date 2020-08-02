import { Injectable } from '@angular/core';
import { SOUNDS } from './sounds';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private soundpath = 'assets/sounds/';
  private loops: {[soundName: string]: HTMLAudioElement} = {};

  constructor() {
    // Preload all sounds
    for (const soundName of SOUNDS) {
      this.createAudio(soundName);
    }
  }

  private createAudio(soundName: string) {
    const audio = new Audio();

    if (audio.canPlayType('audio/ogg;codecs=vorbis') !== '') {
      // play ogg
      audio.src = this.soundpath + soundName + '.ogg';
    } else {
      // mp3 fallback
      audio.src = this.soundpath + soundName + '.mp3';
    }

    audio.preload = 'auto';

    return audio;
  }

  public play(soundName: string) {
    const audio = this.createAudio(soundName);

    audio.oncanplaythrough = () => {
      audio.play();
    };

    return audio;
  }

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

  public toggleMute(soundName: string) {
    this.loops[soundName].muted = !this.loops[soundName].muted;
  }
}
