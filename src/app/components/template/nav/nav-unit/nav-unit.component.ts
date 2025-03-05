import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InterfaceMenu } from 'src/app/interfaces/interfaceMenu';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-nav-unit',
  templateUrl: './nav-unit.component.html',
  styleUrls: ['./nav-unit.component.css']
})
export class NavUnitComponent implements OnInit {
  menuListUnit!: Array<InterfaceMenu>;
 @Input() selectedMenuItem: InterfaceMenu | null = null;
  selectMenuItem(item: InterfaceMenu): void {
    this.selectedMenuItem = item;
    this.menuListUnit.forEach((menuItem) => (menuItem.menuSelected = false));
    item.menuSelected = true;
    this.router.navigate([item.navigateRouter]);
  }

  constructor(private router: Router, public uiService: UIService) {}
  ngOnInit(): void {
    this.menuListUnit =[
      // {
      //   imgPath: 'assets/icone/settings.png',
      //   menuName: 'Configuração',
      //   menuSelected: false,
      //   navigateRouter: '/home',
      // },
      {
        imgPath: 'assets/icone/budget.png',
        menuName: 'Financeiro',
        menuSelected: false,
        navigateRouter: '/financial',
      },
      {
        imgPath: 'assets/icone/customer-service.png',
        menuName: 'Suporte',
        menuSelected: false,
        navigateRouter: '/map',
      },
    ];
    
  }

}
