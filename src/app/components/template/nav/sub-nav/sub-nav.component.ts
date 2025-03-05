import { InterfaceMenu } from 'src/app/interfaces/interfaceMenu';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sub-nav',
  templateUrl: './sub-nav.component.html',
  styleUrls: ['./sub-nav.component.css']
})
export class SubNavComponent {
  @Input() itemMenu!: InterfaceMenu
  @Input() last = false
  isOpen = false;
  
}
