import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() title: string = ""; // TODO: remove pointless @Input example
  @Input() user: any;
  @Output() loginLogout = new EventEmitter<boolean>();

  login(): void { this.loginLogout.next(true); }
  logout(): void { this.loginLogout.next(false); }
}
