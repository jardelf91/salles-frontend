import { CrudService } from 'src/app/services/crud.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService extends CrudService  {

  constructor(http: HttpClient) {
    super(http, '/payment-methods');
   }
}
