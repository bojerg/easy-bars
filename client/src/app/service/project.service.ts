import { Injectable } from '@angular/core';
import { Canvas } from '../model/canvas';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projectSource = new BehaviorSubject(new Canvas([]));
  canvas = this.projectSource.asObservable();

  constructor() {}

  updateProject(canvas: Canvas) {
    this.projectSource.next(canvas);
  }
  
}
