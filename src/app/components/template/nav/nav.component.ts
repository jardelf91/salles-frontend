import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InterfaceMenu } from 'src/app/interfaces/interfaceMenu';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  menuList!: Array<InterfaceMenu>;
  menuListChildren!: Array<InterfaceMenu>;
  showOutrosItems: boolean = false;
  @Input() list!: Array<InterfaceMenu>;

  @Input() itemMenu!: InterfaceMenu;
  @Input() last: boolean = false;
  @Input() selectedMenuItem: InterfaceMenu | null = null;
  currentRoute: string;
  selectMenuItem(item: InterfaceMenu): void {
    this.selectedMenuItem = item;
    this.menuList.forEach((menuItem) => (menuItem.menuSelected = false));
    item.menuSelected = true;
    this.router.navigate([item.navigateRouter]);
  }

  constructor(private router: Router, public uiService: UIService) {
    this.currentRoute = this.router.url;
  }

  ngOnInit(): void {
    this.menuList = [
      {
        imgPath: 'assets/icone/analysis.png',
        menuName: 'Estatística',
        menuSelected: false,
        navigateRouter: '/statistics',
      },
     
      {
        imgPath: 'assets/icone/pay.png',
        menuName: 'Forma de pagamento',
        menuSelected: false,
        navigateRouter: '/payment',
      },
      {
        imgPath: 'assets/icone/classification.png',
        menuName: 'Categoria',
        menuSelected: false,
        navigateRouter: '/categories',
      },

      
      {
        imgPath: 'assets/icone/customer-satisfaction.png',
        menuName: 'Cliente',
        menuSelected: false,
        navigateRouter: '/customers',
      },
      
    ];

    const activeItem = this.menuList.find((item) =>
      this.currentRoute.includes(item.navigateRouter)
    );
    if (activeItem) {
      activeItem.menuSelected = true;
      this.selectedMenuItem = activeItem;
    }
  
  }

  


  navigateMenuPages() {
    this.router.navigate(['/mission-create']);
  }

  showOutrosMenuItems() {
    this.showOutrosItems = !this.showOutrosItems;
  }
}
