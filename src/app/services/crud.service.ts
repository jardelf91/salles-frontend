
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environment/environment';
export const CRUD_SERVICE_PATH = new InjectionToken<string>(
  'crud_service_path'
);

@Injectable({
  providedIn: 'root'
})
export abstract class CrudService {

  protected listSource = new BehaviorSubject<any[]>([]);

  constructor(
    protected http: HttpClient,
    @Inject(CRUD_SERVICE_PATH) protected path: string
  ) {}

  create(obj: Object, endpoint?: string): Observable<any> {
    const createPath = endpoint || this.path; 
    return this.http.post(`${environment.API}${createPath}`, obj);
  }

  update(obj: Object): Observable<any> {
    return this.http.put(`${environment.API}${this.path}`, obj);
  }

  findOne(id: string, endpoint?: string): Observable<any> {
    const createPath = endpoint || this.path; 
    return this.http.get(`${environment.API}${createPath}/${id}`);
  }

  findAll(args?: any): Observable<any[]> {
    return this.http
      .get<any[]>(`${environment.API}${this.path}`, { params: args })
      .pipe(tap((data) => this.listSource.next(data)));
  }

  delete(id: string, endpoint?: string): Observable<any> {
    const createPath = endpoint || this.path; 
    return this.http.delete(`${environment.API}${createPath}/${id}`);
  }

  disable(id: string): Observable<any> {
    return this.http.put(`${environment.API}${this.path}/disable/${id}`, {});
  }

  clear() {
    this.listSource.next([]);
  }
}
