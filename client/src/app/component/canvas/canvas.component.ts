import { Component, HostListener, Input } from '@angular/core';
import { Phrase } from '../../model/phrase';
import { Page } from '../../model/page';
import { PageComponent } from '../page/page.component';
import { MatDialog } from '@angular/material/dialog';

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
  pages: Page[] = [];

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.calculateBarsPerRow();

    // temporary number in lieu of object oriented approach
    for(let i = 1; i <= 17; i++) {
      this.bars.push(i);
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.calculateBarsPerRow();
  }

  calculateBarsPerRow() {
    this.barsPerRow = Math.floor(window.innerWidth / 400);
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
