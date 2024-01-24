import { Component, Inject, HostListener, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu'; 
import { Page } from '../../model/page';
import { Phrase } from '../../model/phrase';

/** 
 * Simple interface to aid in controlling how to display the phrase currently being edited. 
 * @param index - index of the phrase in page.lyrics array
 * @param mode - flag for how to render phrase card
 * @param stepSize - duraton slider step size. Used as a multiple for min and max setting of #timeSlider
 * @remarks Mode types anticipated are 'content' (simple input editor), 'notepad' (textarea for longer input), and 'split' (split phrase into smaller chunks). 
 * This may be changed to numbers in the future.
*/
export interface ActivePhrase {
  index: number,
  mode: string,
  stepSize: number
}

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatMenuModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {

  screenHeight: number = 0;
  screenWidth: number = 0;
  activePhrase: ActivePhrase = {
    index: 0,
    mode: '',
    stepSize: 0.0625
  }

  /** Used organize rows of phrases by bar length */
  beat: number = 0;
  /** defined separately from the Page object's title for clear on click-- see component HTML at id page-title */
  placeholderTitle: string = "";

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PageComponent>,
    @Inject(MAT_DIALOG_DATA) public page: Page,
  ) { 
    this.onResize();
    this.placeholderTitle = page.title;
  }

  @ViewChild('active') lyricInput: any;

  /** Ensure page dialog fills majority of usable screen space on window resize */
  @HostListener('window:resize', ['$event'])
  onResize(_event?: undefined) {
   this.screenHeight = window.innerHeight;
   this.screenWidth = window.innerWidth;
  }

  addPhrase(): void {
    this.page.lyrics.push(new Phrase('Test', 0.5));
  }

  deletePhrase(index: number) {
    if(confirm("Are you sure you would like to delete this phrase?")) this.page.lyrics.splice(index, 1);
  }

  duplicatePhrase(index: number) {
    let duplicate = new Phrase(this.page.lyrics[index].content, this.page.lyrics[index].duration);
    this.page.lyrics.splice(index, 0, duplicate);
  }

  saveTitle(title: string): void {
    if (title === "") {
      alert("Title needs text");
    } else {
      this.page.title = title;
      this.placeholderTitle = title;
    }
  }

  saveAndCloseContentEditor(index: number): void {
    this.page.lyrics[index].content = this.lyricInput.nativeElement.value;
    this.activePhrase.mode = '';
  }

  splitLyricsByWord() { // needs rework
    const notWhitespace = new RegExp(/\S/);
    let newLyrics: Phrase[] = [];
    this.page.lyrics.forEach( (phrase) => {
      let tempStr = "";
      phrase.content.split("").forEach( (char, i) => {  
        if(char.match(notWhitespace)) {
          if(tempStr.slice(tempStr.length - 1).match(notWhitespace)) tempStr += char;
          else {
            if(tempStr.trim() !== '') newLyrics.push(new Phrase(tempStr, 0.5));
            tempStr = char;
          }
        } else {
          tempStr += char
        }
        if(i == phrase.content.length - 1) {
          newLyrics.push(new Phrase(tempStr, 0.5));
        }
      });
    });
    this.page.lyrics = newLyrics.slice(1);
  }

  isNextBar(duration: number, first: boolean): boolean {
    if(first) this.beat = 0;
    const previous = Math.floor(this.beat / 4);
    this.beat += duration;
    return this.beat / 4 >= previous + 1;
  }

  toggleActive(index: number): void {
    if(this.activePhrase.mode === '' && this.activePhrase.index === index) this.activePhrase.index = -1;
    else this.activePhrase.index = index;
  }

  toggleContentMode(): void {
    if(this.activePhrase.mode === 'content') this.activePhrase.mode = '';
    else this.activePhrase.mode = 'content';
  }

  toggleTimeMode(): void {
    if(this.activePhrase.mode === 'time') this.activePhrase.mode = '';
    else {
      this.activePhrase.mode = 'time';
      this.activePhrase.stepSize = 0.0625;
    } 
  }

  timeCtrlToggleStep(): void {
    if(this.activePhrase.stepSize == 0.0625) this.activePhrase.stepSize *= 8;
    else this.activePhrase.stepSize /= 8;
  }

  timeCtrlGetStepContext(): string {
    if(this.activePhrase.stepSize == 0.0625) return "Big steps";
    return "Small steps";
  }

  timeNotchUp(index: number): void {    
    if(this.page.lyrics[index].duration < this.activePhrase.stepSize * 128) {
      this.page.lyrics[index].duration += this.activePhrase.stepSize;
    }
  }

  timeNotchDown(index: number): void {
    if(this.page.lyrics[index].duration > this.activePhrase.stepSize) {
      this.page.lyrics[index].duration -= this.activePhrase.stepSize;
    }
  }

}
