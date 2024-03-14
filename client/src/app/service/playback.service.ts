import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Playback } from '../model/playback';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  private playbackSource = new BehaviorSubject(new Playback(false, false, false, 0, 0.0, 100));
  playback = this.playbackSource.asObservable();

  metronome = new Howl({src: ['../../../assets/metronome_1.mp3'], sprite: {"metronome": [0, 600, true]}});
  instrumental: Howl | undefined;

  play(playback: Playback): void {
    playback.playing = true;
    this.playbackSource.next(playback);
    if(playback.metronome) this.metronome.play("metronome");
    if(this.instrumental !== undefined) this.instrumental.play();
  }

  pause(playback: Playback): void {
    playback.playing = false;
    playback.paused = true;
    this.playbackSource.next(playback);
    if(playback.metronome) this.metronome.pause();
    if(this.instrumental !== undefined) this.instrumental.pause();
  }

  stop(playback: Playback): void {
    playback.playing = false;
    playback.paused = false;
    this.playbackSource.next(playback);
    if(playback.metronome) this.metronome.stop();
    if(this.instrumental !== undefined) this.instrumental.stop();
  }

  setBpm(bpm: number, playback: Playback): void {
    playback.bpm = bpm;
    playback.playing = false;
    playback.paused = false;
    this.playbackSource.next(playback);
    const newDuration = 60000 / bpm;
    this.metronome.stop();
    if(this.instrumental !== undefined) this.instrumental.stop();
    this.metronome = new Howl({src: ['../../../assets/metronome_1.mp3'], sprite: {"metronome": [0, newDuration, true]}});
  }

  setMetronome(setting: boolean, playback: Playback): void {
    playback.metronome = setting;
    this.playbackSource.next(playback);
  }

}