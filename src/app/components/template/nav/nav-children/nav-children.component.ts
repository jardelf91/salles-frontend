import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { InterfaceMenu } from 'src/app/interfaces/interfaceMenu';

@Component({
  selector: 'app-nav-children',
  templateUrl: './nav-children.component.html',
  styleUrls: ['./nav-children.component.css'],
})
export class NavChildrenComponent implements OnInit {
  menuListChildren!: Array<InterfaceMenu>;

  constructor() {}

  ngOnInit(): void {
    this.menuListChildren = [
      // {
      //   imgPath: 'assets/icone/calendar.svg',
      //   menuName: 'Conquistas',
      //   menuSelected: false,
      //   navigateRouter: '/home',
      //   subMenu: [
      //     {
      //       imgPath: 'assets/icone/calendar.svg',
      //       menuName: 'Estatística',
      //       menuSelected: false,
      //       navigateRouter: '/home',
      //     },
      //   ],
      // },
      // {
      //   imgPath: 'assets/icone/calendar.svg',
      //   menuName: 'Escalas Concluidas',
      //   menuSelected: false,
      //   navigateRouter: '/scale',
      // },
      // {
      //   imgPath: 'assets/icone/calendar.svg',
      //   menuName: 'Escalas Canceladas',
      //   menuSelected: false,
      //   navigateRouter: '/map',
      // },
    ];
  }
}
