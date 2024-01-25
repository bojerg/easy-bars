import { Component, Inject, HostListener, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
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
  imports: [MatCardModule, MatIconModule, MatMenuModule, MatToolbarModule],
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

  deleteAll(): void {
    if(confirm("Are you sure you would like to DELETE ALL phrases from this page?")) this.page.lyrics = [];
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
    const content = this.lyricInput.nativeElement.value;
    
    // process new lines as new phrases
    let newPhrases: Phrase[] = [];
    let tempStr = "";
    let previousWasNewLine = false;
    content.split("").forEach( (char: string, i: number) => {
      if(char.match(/[\r\n]+/)) {
        if(!previousWasNewLine) {
          newPhrases.push(new Phrase(tempStr, 4));
          tempStr = "";
        } 
        previousWasNewLine = true;
      }
      else {
        tempStr += char;
        previousWasNewLine = false;
      }
      if(i == content.length - 1) {
        newPhrases.push(new Phrase(tempStr, 4));
      }
    });
    let array2 = this.page.lyrics.splice(index);
    array2.splice(0, 1);
    this.page.lyrics = this.page.lyrics.concat(newPhrases, array2);
    this.activePhrase.mode = '';
  }

  mergePhraseLeft(index: number): void {
    if(index !== 0) {
      let content = this.page.lyrics[index - 1].content;
      // add whitespace if none present
      if(content.slice(content.length - 1).match(/\S/)) content += " ";
      content += this.page.lyrics[index].content;
      const duration = this.page.lyrics[index].duration + this.page.lyrics[index - 1].duration;
      let merged = new Phrase(content, duration);
      this.page.lyrics.splice(index - 1, 2, merged);
    }
  }

  mergePhraseRight(index: number): void {
    if(index !== this.page.lyrics.length - 1) {
      let content = this.page.lyrics[index].content;
      // add whitespace if none present
      if(content.slice(content.length - 1).match(/\S/)) content += " ";
      content += this.page.lyrics[index + 1].content;
      const duration = this.page.lyrics[index + 1].duration + this.page.lyrics[index].duration;
      let merged = new Phrase(content, duration);
      this.page.lyrics.splice(index, 2, merged);
    }
  }

  splitPhraseByWord(index: number): void {
    let newPhrases: Phrase[] = [];
    const content = this.page.lyrics[index].content.trim();
    let tempStr = "";
    content.split("").forEach( (char, i) => {
      if(char.match(/\S/)) {
        if(tempStr.slice(tempStr.length - 1).match(/\S/)) tempStr += char;
        else {
          if(tempStr.trim() !== "") newPhrases.push(new Phrase(tempStr, 0.5));
          tempStr = char;
        }
      } else {
        tempStr += char;
      }
      if(i == content.length - 1) {
        newPhrases.push(new Phrase(tempStr, 0.5));
      }
    });
    let array2 = this.page.lyrics.splice(index);
    array2.splice(0, 1);
    this.page.lyrics = this.page.lyrics.concat(newPhrases, array2);
  }

  splitLyricsByWord() { 
    const oldLyrics = structuredClone(this.page.lyrics);
    let newLyrics: Phrase[] = [];
    oldLyrics.forEach((phrase) => {
      let newPhrases: Phrase[] = [];
      const content = phrase.content.trim();
      let tempStr = "";
      content.split("").forEach( (char, i) => {
      if(char.match(/\S/)) {
        if(tempStr.slice(tempStr.length - 1).match(/\S/)) tempStr += char;
        else {
          if(tempStr.trim() !== "") newPhrases.push(new Phrase(tempStr, 0.5));
          tempStr = char;
        }
      } else {
        tempStr += char;
      }
      if(i == content.length - 1) {
        newPhrases.push(new Phrase(tempStr, 0.5));
      }
      });

      newLyrics = newLyrics.concat(newPhrases);
    });

    this.page.lyrics = newLyrics;
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
