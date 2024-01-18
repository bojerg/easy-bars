import { Component, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Page } from '../../model/page';
import { Phrase } from '../../model/phrase';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
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

  renderPhrasesToTextarea(): string {
    let text = ""; this.page.lyrics.forEach( (phrase, i) => {
      if(i !== 0 && phrase.isEmpty()) text += "\n";
      else text += phrase.content;
    });
    return text;
  }

  splitLyricsByWord() {
    const notWhitespace = new RegExp(/\S/);
    let newLyrics: Phrase[] = [];
    this.page.lyrics.forEach( (phrase) => {
      let tempStr = "";
      phrase.content.split("").forEach( (char, i) => {  
        if(char.match(notWhitespace)) {
          if(tempStr.slice(tempStr.length - 1).match(notWhitespace)) tempStr += char;
          else {
            newLyrics.push(new Phrase(tempStr, 0.5));
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

  isNextBar(duration: number): boolean {
    const previous = Math.floor(this.beat / 4);
    this.beat += duration;
    return Math.floor(this.beat / 4) !== previous;
  }

  resetBeatCount(): void {
    this.beat = 0;
  }

  editText(phrase: Phrase) {
    //dummy function

    // Need to dynamically change how the specific card is interactable
  }

}
