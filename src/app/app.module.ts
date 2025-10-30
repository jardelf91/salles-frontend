import { AuthInterceptor } from './auth.interceptor';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoginComponent } from './pages/login/login.component';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';
import { ScaleComponent } from './pages/scale/scale.component';
import { SallesComponent } from './pages/salles/salles.component';
import { ProductComponent } from './pages/product/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { CategorieComponent } from './pages/categorie/categorie.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { PaymentMethodsComponent } from './pages/payment-methods/payment-methods.component';
import { OrderComponent } from './pages/order/order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { FinancialComponent } from './pages/financial/financial.component'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LabComponent } from './pages/lab/lab.component';
import { SiteComponent } from './pages/site/site.component';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoverPasswordComponent,
    ScaleComponent,
    SallesComponent,
    ProductComponent,
    CategorieComponent,
    CustomersComponent,
    PaymentMethodsComponent,
    OrderComponent,
    StatisticsComponent,
    FinancialComponent,
    LabComponent,
    SiteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    MatInputModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    
    NgxPaginationModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'pt',
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => sessionStorage.getItem('authToken'),
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
