import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { Playback } from '../model/playback';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  private playbackSource = new BehaviorSubject(new Playback(false, false, false, 0, 0.0, 100));
  playback = this.playbackSource.asObservable();

  metronome = new Howl({src: ['../../../assets/metronome_1.mp3'], sprite: {"metronome": [0, 600, true]}});
  instrumental: Howl | undefined;
  intervalLenth = 37.5; // 1/16th beat at 100bpm
  intervalId: any = null;

  play(playback: Playback): void {
    playback.playing = true;
    if(playback.metronome) this.metronome.play("metronome");
    if(this.instrumental !== undefined) this.instrumental.play();
    this.intervalId = setInterval(() => this.iterateBeats(playback), this.intervalLenth);
  }

  pause(playback: Playback): void {
    playback.playing = false;
    playback.paused = true;
    if(playback.metronome) this.metronome.pause();
    if(this.instrumental !== undefined) this.instrumental.pause();
    this.clearInterval();
  }

  stop(playback: Playback): void {
    playback.playing = false;
    playback.paused = false;
    if(playback.metronome) this.metronome.stop();
    if(this.instrumental !== undefined) this.instrumental.stop();
    this.resetInterval(playback);
  }

  setBpm(bpm: number, playback: Playback): void {
    playback.bpm = bpm;
    playback.playing = false;
    playback.paused = false;
    this.resetInterval(playback);
    this.metronome.stop();
    if(this.instrumental !== undefined) this.instrumental.stop();
    const newDuration = 60000 / bpm;
    this.metronome = new Howl({src: ['../../../assets/metronome_1.mp3'], sprite: {"metronome": [0, newDuration, true]}});
    this.intervalLenth = newDuration / 16;
  }

  setMetronome(setting: boolean, playback: Playback): void {
    playback.metronome = setting;
    this.playbackSource.next(playback);
  }

  private iterateBeats(playback: Playback): void {
    playback.beat += 0.0625;
    if(playback.beat >= 4) {
      playback.beat = 0;
      playback.bar++;
    }
    this.playbackSource.next(playback);
  }

  private resetInterval(playback: Playback): void {
    this.clearInterval();
    playback.beat = 0;
    playback.bar = 0;
    this.playbackSource.next(playback);
  }

  private clearInterval(): void {
    if(this.intervalId !== null) clearInterval(this.intervalId);
  }

}