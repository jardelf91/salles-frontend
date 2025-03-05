import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UIService {
  private uiControlsVisible = new BehaviorSubject<boolean>(true);
  public uiControlsVisibility = this.uiControlsVisible.asObservable();

  constructor() {}

  hideControls() {
    this.uiControlsVisible.next(false);
  }

  showControls() {
    this.uiControlsVisible.next(true);
  }
}
