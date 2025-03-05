import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class AppSacolaService extends CrudService {

  constructor(http: HttpClient) {
    super(http, '/ws');
  }
}
