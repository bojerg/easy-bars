import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from "@angular/common/http";

export interface Ping {
  message: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ping';
  message: string | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Ping>("/api/ping").subscribe(res => this.message = res.message);
  }
}
