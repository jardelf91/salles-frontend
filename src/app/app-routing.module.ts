import { OrderComponent } from './pages/order/order.component';
import { InfClientComponent } from './components/inf-client/inf-client.component';
import { AppSacolaComponent } from './components/app-sacola/app-sacola.component';
import { PopupEndComponent } from './components/popup-end/popup-end.component';
import { PopupCartComponent } from './components/popup-cart/popup-cart.component';
import { TopBarComponent } from './components/template/top-bar/top-bar.component';
import { SallesComponent } from './pages/salles/salles.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './components/template/nav/nav.component';
import { PageBodyComponent } from './components/template/page-body/page-body.component';
import { LoginComponent } from './pages/login/login.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';
import { ScaleComponent } from './pages/scale/scale.component';
import { ProductComponent } from './pages/product/product.component';
import { CategorieComponent } from './pages/categorie/categorie.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { PaymentMethodsComponent } from './pages/payment-methods/payment-methods.component';
import { ModalComponent } from './components/modal/modal.component';
import { AuthGuard } from './auth.guard';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { FinancialComponent } from './pages/financial/financial.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'body', component: PageBodyComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'recover', component: RecoverPasswordComponent },
  { path: 'scale', component: ScaleComponent, canActivate: [AuthGuard] },
  { path: 'nav', component: NavComponent },
  { path: 'venda', component: SallesComponent },
  { path: 'top', component: TopBarComponent },
  { path: 'carrinho', component: PopupCartComponent },
  { path: 'endereco', component: PopupEndComponent, canActivate: [AuthGuard] },
  { path: 'sacola', component: AppSacolaComponent },
  { path: 'client', component: InfClientComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategorieComponent, canActivate: [AuthGuard] },
  { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentMethodsComponent ,canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'modal', component: ModalComponent, canActivate: [AuthGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [AuthGuard] },
  { path: 'financial', component: FinancialComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
