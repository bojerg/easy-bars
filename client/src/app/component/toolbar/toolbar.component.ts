import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Howl, Howler } from 'howler';
import { CanvasComponent } from "../canvas/canvas.component";

@Component({
    selector: 'app-toolbar',
    standalone: true,
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss',
    imports: [ 
      CanvasComponent, 
      MatTabsModule, 
      MatToolbarModule
    ]
})
export class ToolbarComponent {
  bpm: number = 100.000;
  play: boolean = false;

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
}