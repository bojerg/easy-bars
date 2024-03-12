import { Component, ElementRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Howl, Howler } from 'howler';
import { CanvasComponent } from "../canvas/canvas.component";
import { Subscription } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import WaveSurfer from 'wavesurfer.js';

//TODO: Add metronome!

@Component({
    selector: 'app-toolbar',
    standalone: true,
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
    imports: [ CanvasComponent, MatTabsModule, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressBarModule, CommonModule ]
})

export class ToolbarComponent {
  bpm: number = 100.000;
  play: boolean = false;
  duration: number = 0;
  fileName = '';
  uploadProgress: number | null = null;
  uploadSub!: Subscription;
  waveform!: WaveSurfer;
  sound = new Howl({
    src: ['../../../assets/83 goopy.mp3'],
  });

  @ViewChild('appCanvas')
  canvas!: CanvasComponent;

  ngOnInit(): void {
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
    this.play = true;
    this.sound.play();
  }

  pauseFn(): void {
    this.play = false;
    this.sound.pause();
  }

  stopFn(): void {
    this.play = false;
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
    
    this.bpm = Math.round(val * 1000) / 1000; // 3 decimals max
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
        this.duration = this.sound.duration();
        //Need to set this manually due to angular not refreshing duration value before calcCanvasBars method runs
        this.canvas.duration = this.duration;
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