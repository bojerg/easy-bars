import { Component, Inject, HostListener, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../service/project.service';
import { Page } from '../../model/page';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {

  screenHeight: number = 0;
  screenWidth: number = 0;

  constructor(
    private projectService: ProjectService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PageComponent>,
    @Inject(MAT_DIALOG_DATA) public page: Page,
  ) { this.onResize(); }

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
      this.projectService.updatePage(this.page);
    }
  }
}
