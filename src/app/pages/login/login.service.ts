import { CrudService } from 'src/app/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends CrudService {
  constructor(http: HttpClient) {
    super(http, '/auth/login'); // Certifique-se de que a URL está correta
  }

  login(enrollment: string, password: string): Observable<any> {
    const payload = { enrollment, password, rememberMe: true };
    return this.create(payload);
  }

  setAuthToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  isUserLoggedIn(): boolean {
    return !!this.getAuthToken();
  }

  clearSession(): void {
    sessionStorage.removeItem('authToken');
  }


  getUserFromToken() {
    const token = this.getAuthToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user;
    }
    return null;
  }
}
