import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./component/toolbar/toolbar.component";
import { CanvasComponent } from "./component/canvas/canvas.component";
import { HeaderComponent } from "./component/header/header.component";
import { AuthModule, AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';


/*
import { HttpClient } from "@angular/common/http";


export interface Ping {
  id?: String,
  Pong: string
}
*/

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [CommonModule, RouterOutlet, ToolbarComponent, CanvasComponent, HeaderComponent]
})
export class AppComponent {
  
  title = 'Easy Bars';
  authSub!: Subscription;
  user: any;
  /*
  insertId: string = "";
  pong: Ping | undefined;
  */

  constructor(private auth: AuthService) {
    this.user = {};
  }
  
  ngOnInit(): void { this.authSub = this.auth.user$.subscribe((success: any) => this.user = success); }
  ngOnDestroy(): void { this.authSub.unsubscribe(); }

  doUserLoginAction(login: boolean): void { 
    if(login) {
      this.auth.loginWithRedirect();
    } else {
      this.auth.logout();
    }
  }

  /*
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
  */
}
