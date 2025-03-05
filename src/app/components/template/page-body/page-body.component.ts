import { Component, Input, OnInit } from '@angular/core';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-page-body',
  templateUrl: './page-body.component.html',
  styleUrls: ['./page-body.component.css']
})
export class PageBodyComponent implements OnInit {

  menuOpen = true;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  @Input() hideFooter = false;
  constructor(public uiService: UIService) {}

  ngOnInit(): void {}

}
