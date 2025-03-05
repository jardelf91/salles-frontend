import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CrudService } from 'src/app/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends CrudService {

  constructor(http: HttpClient) {
    super(http, '/orders');
  }

 override findAll(page: number = 0, size: number = 5): Observable<any> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };

    return super.findAll(params);
  }
  
}
