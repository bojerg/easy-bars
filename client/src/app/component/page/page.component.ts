import { Component, Inject, HostListener, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { Page } from '../../model/page';
import { Phrase } from '../../model/phrase';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [MatTabsModule, MatCardModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {

  screenHeight: number = 0;
  screenWidth: number = 0;
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

  /** Ensure page dialog fills majority of usable screen space on window resize */
  @HostListener('window:resize', ['$event'])
  onResize(_event?: undefined) {
   this.screenHeight = window.innerHeight;
   this.screenWidth = window.innerWidth;
  }

  saveTitle(title: string): void {
    if (title === "") {
      alert("Title needs text");
    } else {
      this.page.title = title;
      this.placeholderTitle = title;
    }
  }

  saveText(text: string): void {
    //TODO: set up to save every 20s or on dialog exit... and actually process phrasing, create new phrases for added words and remove any that don't fit...
    // May need to include warnings or something for when flow information will be deleted due to added changes or add an edit word button to the edit flow section
    this.page.lyrics[0] = new Phrase(text, 4);
  }

  renderPhrasesToTextarea(): string {
    let text = ""; this.page.lyrics.forEach( (phrase, i) => {
      if(i !== 0 && phrase.isEmpty()) text += "\n";
      else text += phrase.content;
    });
    return text;
  }

  splitLyricsByWord() {
    this.resetBeatCount();
    let newLyrics: Phrase[] = [];
    this.page.lyrics.forEach( (phrase) => {
        const words = phrase.content.split(" ");
        if(words.length > 1) words.forEach( word => newLyrics.push(new Phrase(word + " ", 1)));
        else newLyrics.push(new Phrase(words[0], 1));
    });
    this.page.lyrics = newLyrics;
  }

  isNextBar(duration: number): boolean {
    const previous = Math.floor(this.beat / 4);
    this.beat += duration;
    console.log(Math.floor(this.beat / 4) + " vs " + previous);
    return Math.floor(this.beat / 4) !== previous;
  }

  resetBeatCount(): void {
    this.beat = 0;
  }

}
