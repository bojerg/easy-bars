import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { Playback } from '../model/playback';
import { PlaybackPhrase } from '../component/canvas/canvas.component';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  private metronome = new Howl({src: ['../../../assets/metronome_1.mp3'], sprite: {"metronome": [0, 600, true]}});
  private instrumental: Howl | undefined;
  private intervalLenth = 37.5; // 1/16th beat at 100bpm
  private intervalId: any = null;
  private bars: number = 28;

  private playbackSource = new BehaviorSubject(new Playback(false, false, false, 0, 0.0, 100));
  playback = this.playbackSource.asObservable();

  private selectedBars1: PlaybackPhrase[][] = [];
  private selectedBars2: PlaybackPhrase[][] = [];
  private selectedBars3: PlaybackPhrase[][] = [];

  play(playback: Playback): void {
    playback.playing = true;
    if(playback.metronome) this.metronome.play("metronome");
    if(this.instrumental !== undefined) this.instrumental.play();
    this.generateBarsQueues(playback);
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

  setInstrumental(instrumental: Howl | undefined): void {
    this.instrumental = instrumental;
  }

  setPlaybackBars(bars: number): void {
    this.bars = bars;
  }

  setPlayback(playback: Playback): void {
    this.playbackSource.next(playback);
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

  setSelectedBars(selectedBars: PlaybackPhrase[][], index: number, playback: Playback) {
    if(index > 0 && index < 4) {
      switch(index) {
        case 1: {
          this.selectedBars1 = selectedBars;
          break;
        }
        case 2: {
          this.selectedBars2 = selectedBars;
          break;
        }
        case 3: {
          this.selectedBars3 = selectedBars;
          break;
        }
      }
      this.generateBarsQueues(playback);
    }
  }

  private generateBarsQueues(playback: Playback): void {
    playback.barsQueue1 = [];
    playback.barsQueue2 = [];
    playback.barsQueue3 = [];

    let searchBarNum = 0;
    if(this.selectedBars1[0] !== undefined) {
      while(searchBarNum <= playback.bar + 3) {
        //selected1 generate
        if(this.selectedBars1[searchBarNum][0].beat && Math.floor(this.selectedBars1[searchBarNum][0].beat / 4) > playback.bar - 4) {
          playback.barsQueue1.push(this.selectedBars1[searchBarNum]);
        } 
        searchBarNum++;
      }
    }

    searchBarNum = 0;
    if(this.selectedBars2[0] !== undefined) {
      while(searchBarNum <= playback.bar + 3) {
        //selected2 generate
        if(this.selectedBars2[searchBarNum][0].beat && Math.floor(this.selectedBars2[searchBarNum][0].beat / 4) > playback.bar - 4) {
          playback.barsQueue2.push(this.selectedBars2[searchBarNum]);
        } 
        searchBarNum++;
      }
    }

    searchBarNum = 0;
    if(this.selectedBars3[0] !== undefined) {
      while(searchBarNum <= playback.bar + 3) {
        //selected3 generate
        if(this.selectedBars3[searchBarNum][0].beat && Math.floor(this.selectedBars3[searchBarNum][0].beat / 4) > playback.bar - 4) {
          playback.barsQueue3.push(this.selectedBars3[searchBarNum]);
        } 
        searchBarNum++;
      }
    }
  }

  private iterateBeats(playback: Playback): void {
    playback.beat += 0.0625;
    if(playback.beat >= 4) {
      playback.beat = 0;
      playback.bar++;
      this.generateBarsQueues(playback);
    }
    if(playback.bar <= this.bars) {
      this.playbackSource.next(playback);
    } else {
      this.stop(playback);
    }
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