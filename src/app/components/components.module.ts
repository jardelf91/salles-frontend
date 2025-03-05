import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from './button/button.component';
import { HeaderComponent } from './template/header/header.component';
import { NavComponent } from './template/nav/nav.component';
import { PageBodyComponent } from './template/page-body/page-body.component';
import { SubNavComponent } from './template/nav/sub-nav/sub-nav.component';
import { NavChildrenComponent } from './template/nav/nav-children/nav-children.component';
import { NavUnitComponent } from './template/nav/nav-unit/nav-unit.component';
import { TopBarComponent } from './template/top-bar/top-bar.component';
import { PopupCartComponent } from './popup-cart/popup-cart.component';
import { PopupEndComponent } from './popup-end/popup-end.component';
import { AppSacolaComponent } from './app-sacola/app-sacola.component';
import { InfClientComponent } from './inf-client/inf-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [ButtonComponent, NavComponent, HeaderComponent, PageBodyComponent, SubNavComponent, NavChildrenComponent, NavUnitComponent, TopBarComponent, PopupCartComponent, PopupEndComponent, AppSacolaComponent, InfClientComponent, ModalComponent],
  imports: [TranslateModule,CommonModule, RouterLink, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [RouterModule, PageBodyComponent, TopBarComponent, AppSacolaComponent, ModalComponent],
})
export class ComponentsModule {}
