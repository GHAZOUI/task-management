import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthConfig } from 'angular-oauth2-oidc';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap } from 'rxjs';

const authConfig: AuthConfig = {
  issuer: 'https://localhost:7025',
  redirectUri: window.location.origin,
  tokenEndpoint: 'https://localhost:7025/connect/token', // Endpoint pour récupérer le token
  clientId: 'task_management_app',
  dummyClientSecret: 'MaSuperCléSecrète123!MaSuperCléSecrète123!', // Remplace par ton client secret (si nécessaire)
  scope: 'openid profile email',
  responseType: 'code',
  requireHttps: false, // Mets à `false` si tu testes en local sans HTTPS
  strictDiscoveryDocumentValidation: false
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  public apiUrl = authConfig.issuer + '/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const credentials= { username, password };
    return this.http.post(`${this.apiUrl}/account/login`, credentials).pipe(
        tap((res: any) => {
          if (res.accessToken && res.refreshToken) {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);
            localStorage.setItem('accessTokenExpiration', res.accessTokenExpiration);
          }
        })
      );
  }

//   register(username: string, email: string, password: string): Observable<any> {
  register(data: any): Observable<any> {
    // const data= { username, email, password };
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getDecodedToken(): any {
    const token = this.getAccessToken();
    return token ? jwtDecode(token) : null;
  }

  isAccessTokenExpired(): boolean {
    const expiration = localStorage.getItem('accessTokenExpiration');
    return expiration ? new Date(expiration) < new Date() : true;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token || this.isAccessTokenExpired()) return false;

    const decodedToken: any = this.getDecodedToken();
    return decodedToken && decodedToken.exp * 1000 > Date.now();
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpiration');
    this.router.navigate(['/login']);
  }
}
