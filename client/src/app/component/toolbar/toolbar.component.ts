import { Component, Input } from '@angular/core';
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

@Component({
    selector: 'app-toolbar',
    standalone: true,
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
    imports: [ CanvasComponent, MatTabsModule, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressBarModule, CommonModule ]
})
export class ToolbarComponent {
[x: string]: any;
  bpm: number = 100.000;
  play: boolean = false;
  
  fileName = '';
  uploadProgress: number | null = null;
  uploadSub!: Subscription;

  sound = new Howl({
    src: ['../../../assets/83 goopy.mp3'],
  });

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
    const file:File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);

      /*
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

      this.sound = new Howl({ src: file.webkitRelativePath});
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
  }

}