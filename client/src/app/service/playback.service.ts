import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Playback } from '../model/playback';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  private playbackSource = new BehaviorSubject(new Playback(false, false, 0, 0.0, 100));
  playback = this.playbackSource.asObservable();

  constructor() {}

  play(playback: Playback): void {
    playback.playing = true;
    this.playbackSource.next(playback);
  }

  pause(playback: Playback): void {
    playback.playing = false;
    playback.paused = true;
    this.playbackSource.next(playback);
  }

  stop(playback: Playback): void {
    playback.playing = false;
    playback.paused = false;
    this.playbackSource.next(playback);
  }

  setBpm(bpm: number, playback: Playback): void {
    playback.bpm = bpm;
    this.playbackSource.next(playback);
  }
}