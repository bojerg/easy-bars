import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from "@angular/common/http";

export interface Ping {
  id?: String,
  Pong: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ping pong stack verification';
  insertId: string = "";
  pong: Ping | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const ping: Ping = {
      Pong: "pong"
    }
    this.http.post<any>("/api/ping", ping).subscribe(res => this.insertId = res.data.InsertedId);
  }

  getPing() {
    if (this.insertId !== "") {
      this.http.get<Ping>("/api/pong/" + this.insertId).subscribe(res => this.pong = res);
    } else {
      console.log("the requested ping is undefined")
    }
  }
}
