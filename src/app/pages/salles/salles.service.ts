import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SallesService extends CrudService {

  constructor(http: HttpClient) {
    super(http, '/salles');
  }

  getProducts() {
    return this.http.get(`${environment.API}/products`); 
  }


  getCategories() {
    return this.http.get(`${environment.API}/categories`);  
  }

  getCustomerByPhone(phone: string): Observable<any> {
    return this.http.get(`${environment.API}/customers/phone/${phone}`);
  }

  createOrder(order: any): Observable<any> {
    return this.http.post(`${environment.API}/orders`, order);
  }
}
