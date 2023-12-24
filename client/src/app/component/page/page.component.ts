import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Page } from '../../model/page';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss'
})
export class PageComponent {
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PageComponent>,
    @Inject(MAT_DIALOG_DATA) public page: Page
  ) {}
}
