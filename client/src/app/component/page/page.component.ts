import { Component, Inject, HostListener, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ProjectService } from '../../service/project.service';
import { Page } from '../../model/page';
import { Phrase } from '../../model/phrase';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {

  screenHeight: number = 0;
  screenWidth: number = 0;

  /** defined separately from the Page object's title for clear on click-- see component HTML at id page-title */
  placeholderTitle: string = "";

  constructor(
    private projectService: ProjectService,
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
      this.projectService.updatePage(this.page);
    }
  }

  saveText(text: string): void {
    //TODO: set up to save every 20s or on dialog exit... and actually process phrasing
    this.page.lyrics[0] = new Phrase(text, 4);
  }

  renderPhrasesToTextarea(): string {
    console.log(this.page.lyrics.length);
    let text = ""; this.page.lyrics.forEach( (phrase, i) => {
      if(i !== 0 && phrase.isEmpty()) text += "\n";
      else text += phrase.content;
    });
    return text;
  }
}
