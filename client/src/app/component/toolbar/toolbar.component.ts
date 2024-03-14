import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Howl } from 'howler';
import { CanvasComponent } from "../canvas/canvas.component";
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import WaveSurfer from 'wavesurfer.js';
import { Playback } from '../../model/playback';
import { PlaybackService } from '../../service/playback.service';

/*
TODO: 
Create playback service (MP3 + metronome + Subscription for current sub-beat)
Add metronome!
*/

@Component({
    selector: 'app-toolbar',
    standalone: true,
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
    imports: [ CanvasComponent, MatTabsModule, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressBarModule, CommonModule ]
})

export class ToolbarComponent {
  fileName = '';
  uploadProgress: number | null = null;
  uploadSub!: Subscription;

  playbackSub: Subscription = new Subscription;
  playback!: Playback;
  waveform!: WaveSurfer;
  sound = new Howl({
    src: ['../../../assets/83 goopy.mp3'],
  });

  @ViewChild('appCanvas')
  canvas!: CanvasComponent;

  constructor(private playbackService: PlaybackService) {}

  ngOnInit(): void {
    this.playbackSub = this.playbackService.playback.subscribe(playback => this.playback = playback);
  }

  ngAfterViewInit(): void {
    this.waveform = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'pink',
      barHeight: 0.9,
      autoplay: false,
      autoScroll: false,
      dragToSeek: false,
      hideScrollbar: true,
      cursorWidth: 0,
      interact: false,
      mediaControls: false
    });
  }

  playFn(): void {
    this.playbackService.play(this.playback);
    this.sound.play();
  }

  pauseFn(): void {
    this.playbackService.pause(this.playback);
    this.sound.pause();
  }

  stopFn(): void {
    this.playbackService.stop(this.playback);
    this.sound.stop();
  }

  setBPM(val: any): void {
    val = Number(val)
    if (typeof val !== "number" || !isFinite(val)) {
      alert("BPM must be a number"); return; 
    }
    if (val < 0) { 
      alert("BPM must be greater than 0"); return; 
    }
    if (val > 300) {  
      alert("BPM must be less than 300"); return;
    }
    
    this.playbackService.setBpm(Math.round(val * 1000) / 1000, this.playback); // 3 decimals max
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const source = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append("thumbnail", file);

      /* waiting for backend
      const upload$ = this.http.post("/api/thumbnail-upload", formData, {
          reportProgress: true,
          observe: 'events'
      })
      .pipe(
          finalize(() => this.reset())
      );
    
      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      })
      */

      // Load uploaded file into wavesurfer/howler, save duration value
      this.waveform.load(source);
      this.sound = new Howl({ src: [source], format: ['mp3']});
      this.sound.on("load", (_: any) => {
        this.canvas.duration = this.sound.duration();
        this.canvas.calculateCanvasBars();
      });
    }
  }

  getMp3TrackLabel(): string {
    return this.fileName !== '' ? this.fileName.substring(0, this.fileName.length - 4) : "MP3 Track";
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
  }

}