import { Component, HostListener, Input } from '@angular/core';

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
  
  ngOnInit() {
    this.calculateBarsPerRow();

    // temporary number in lieu of object oriented approach
    for(let i = 1; i <= 16; i++) {
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
}
