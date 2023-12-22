import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CanvasComponent } from "../canvas/canvas.component";
import { Page } from '../../model/page';

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
  pause: boolean = false;

  pages: Page[] = [];

  setBPM(val: any) {
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

  newPage() {
    // open page modal
  }
}
