import { Component, HostListener, Input } from '@angular/core';
import { Page } from '../../model/page';
import { PageComponent } from '../page/page.component';
import { MatDialog } from '@angular/material/dialog';
import { Canvas } from '../../model/canvas';
import { ProjectService } from '../../service/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
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
  canvas: Canvas = new Canvas([]);

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
    let page = this.canvas.getNewPage();
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

}
