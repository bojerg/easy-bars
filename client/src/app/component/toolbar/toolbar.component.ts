import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from "@angular/material/dialog";
import { Howl, Howler } from 'howler';
import { CanvasComponent } from "../canvas/canvas.component";
import { PageComponent } from '../page/page.component';
import { Page } from '../../model/page';
import { Phrase } from '../../model/phrase';

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

  pages: Page[] = [];

  constructor(private dialog: MatDialog) {}

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

  newPage(): void { 
    let title = this.getNewPageTitle();
    const lyrics: Phrase[] = [];
    let page = new Page(title, lyrics, false)
    this.pages.push(page);
    this.openPage(page);
  }

  openPage(page: Page): void { 
    const config = {
      data: page,
      minWidth: '95vw',
      height: '91vh'
    }

    this.dialog.open(PageComponent, config);
  }

  /** Page #1, Page #2, ... until name is unique */
  private getNewPageTitle(): string {
    let i = 1; while (true) {
      if (this.pages.some(page => page.title === "Page #" + i)) i++;
      else return "Page #" + i;
    }
  }
}