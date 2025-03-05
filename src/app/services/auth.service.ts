import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private jwtHelper: JwtHelperService) {}
  getDecodedToken(): any {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      return this.jwtHelper.decodeToken(token) as any;
    }
    return null;
  }
  getUserProfile(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.user.profile : null;
  }
}
