import { Component, HostListener, Input } from '@angular/core';
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

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [MatCardModule, MatIconModule, DragDropModule, CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})

export class CanvasComponent {

  @Input() bpm: number = 100;
  @Input() play: boolean = false;
  @Input() pause: boolean = false;

  bars: number[] = [];
  barsPerRow: any;
  
  canvasSub: Subscription = new Subscription;
  canvas!: Canvas;

  dragStart: any;
  dragIndex: number = -1;

  constructor(private dialog: MatDialog, private projectService: ProjectService) {}

  ngOnInit() {
    this.projectService.canvas.subscribe(canvas => this.canvas = canvas);
    this.calculateBarsPerRow();



    // temporary number in lieu of object oriented approach
    for(let i = 1; i <= 17; i++) {
      this.bars.push(i);
    }
  }

  ngOnDestroy() {
    this.canvasSub.unsubscribe();
  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.calculateBarsPerRow();
  }

  calculateBarsPerRow() {
    this.barsPerRow = Math.floor(window.innerWidth / 400);
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

    this.dialog.open(PageComponent, config);
  }

  getCardWidth(index: number): number {
    const duration = this.canvas.tracks[index].getFullDuration();
    return duration > 4 ? duration * 44 : 176;
  }

  // https://stackoverflow.com/questions/70385721/angular-material-cdk-drag-and-drop-snap-to-grid-internal-element-cdkdragconstrai
  dragStarted(event: CdkDragStart, index: number): void {
      this.dragStart = event.source.element.nativeElement.getBoundingClientRect();
      this.dragIndex = index;
  }
  computeDragRenderPos(pos: any, _: any): {x: number, y: number} {
      // will render the element every 22 pixels horizontally
      const delta = pos.x - this.dragStart.x;
      let xPos = this.dragStart.x + Math.floor(delta / 22) * 22;
      this.canvas.tracks[this.dragIndex].start = (xPos - 112) / 44;
      return {x: xPos, y: this.dragStart.y};
  }
}
