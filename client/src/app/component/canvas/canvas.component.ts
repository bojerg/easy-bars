import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Page } from '../../model/page';
import { PageComponent } from '../page/page.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { Canvas } from '../../model/canvas';
import { ProjectService } from '../../service/project.service';
import { Subscription } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { Playback } from '../../model/playback';
import { Phrase } from '../../model/phrase';

/*
TODO:
Complete perform tab showing lyrics-- highlighted on beat
Add playback position bar
Flesh out page control UI and functionality
Fix dragging to not fixate on cursor position
*/

export interface PlaybackPhrase {
  phrase: Phrase;
  bar: number;
  beat: number;
}

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatTabsModule, DragDropModule, CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})

export class CanvasComponent {

  @Input() playback!: Playback;
  @Input() duration: number = 0;
  @Input() mp3Name: string = "";

  bars: number[] = [];
  
  canvasSub: Subscription = new Subscription;
  canvas!: Canvas;

  dragStart: any;
  dragIndex: number = -1;

  selectedIndex1: number = -1;
  selectedIndex2: number = -1;
  selectedIndex3: number = -1;

  constructor(private dialog: MatDialog, private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.canvas.subscribe(canvas => {
      this.canvas = canvas;
      this.calculateCanvasBars();
    });
  }

  ngOnDestroy() {
    this.canvasSub.unsubscribe();
  }

  calculateCanvasBars(): void {
    let bars = Math.floor(((this.duration / 60) * this.playback.bpm) / 4) + 2;
    bars = bars > 28 ? bars : 28;
    this.canvas.tracks.forEach(page => {
      const fullDur = Math.floor((page.getFullDuration() + page.start) / 4) + 2;
      bars = fullDur > bars ? fullDur : bars;
    });

    this.bars = [];
    for(let i = 1; i <= bars; i++) {
      this.bars.push(i);
    }
  }

  newPage(): void { 
    let page = this.canvas.addNewPage();
    this.openPage(page);
  }

  openPage(page: Page): void { 
    const config = {
      data: page,
      minWidth: '95vw',
      height: '91vh'
    }

    let dialogRef = this.dialog.open(PageComponent, config);
    dialogRef.afterClosed().subscribe( _ => this.calculateCanvasBars());
  }

  getCardWidth(index: number): number {
    const duration = this.canvas.tracks[index].getFullDuration();
    return duration > 8 ? duration * 16 : 128;
  }

  getDurationPx(): number {
    return this.duration / 15 * this.playback.bpm * 4;
  }

  getPageBars(index: number): PlaybackPhrase[][] {
    let bars: PlaybackPhrase[][] = [];
    let beatCount = this.canvas.tracks[index].start;
    let barCount = 0;

    while(beatCount >= 4) {
      beatCount -= 4;
      barCount++;
    }
    
    this.canvas.tracks[index].lyrics.forEach(phrase => {
      bars[barCount].push({
        phrase: phrase,
        bar: barCount,
        beat: beatCount
      });

      beatCount += phrase.duration;
      while(beatCount >= 4) {
        beatCount -= 4;
        barCount++;
      }
    });

    return bars;
  }

  selectPlaybackPage(index: number) {
    // selected index 1/2/3 as a hierarchy
    if(this.selectedIndex1 === -1) {
      this.selectedIndex1 = index;
    } else if(this.selectedIndex1 === index) {
      this.selectedIndex1 = -1;
    } else if(this.selectedIndex2 === -1) {
      this.selectedIndex2 = index;
    } else if(this.selectedIndex2 === index) {
      this.selectedIndex2 = -1;
    } else if(this.selectedIndex3 === -1) {
      this.selectedIndex3 = index;
    } else if(this.selectedIndex3 === index) {
      this.selectedIndex3 = -1;
    } else {
      this.selectedIndex3 = index;
    }

    //clean up gaps
    if(this.selectedIndex2 === -1 && this.selectedIndex3 !== -1) {
      this.selectedIndex2 = this.selectedIndex3;
      this.selectedIndex3 = -1;
    }
    if(this.selectedIndex1 === -1 && this.selectedIndex2 !== -1) {
      this.selectedIndex1 = this.selectedIndex2;
      this.selectedIndex2 = -1;
    }
  }

  checkPlaybackSelectStatus(index: number): boolean {
    return this.selectedIndex1 === index || this.selectedIndex2 === index || this.selectedIndex3 === index;
  }

  // https://stackoverflow.com/questions/70385721/angular-material-cdk-drag-and-drop-snap-to-grid-internal-element-cdkdragconstrai
  dragStarted(event: CdkDragStart, index: number): void {
    this.dragStart = event.source.element.nativeElement.getBoundingClientRect();
    this.dragIndex = index;
  }

  computeDragRenderPos(pos: any, _: any): {x: number, y: number} {
    // will render the element every 16 pixels horizontally
    const delta = pos.x - this.dragStart.x;
    let xPos = this.dragStart.x + Math.floor(delta / 16) * 16;
    this.canvas.tracks[this.dragIndex].start = (xPos - 112) / 16;
    this.calculateCanvasBars();
    return {x: xPos, y: this.dragStart.y};
  }
}
