import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, throwError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const accessToken = this.authService.getAccessToken();

    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const refreshToken = this.authService.getRefreshToken();
    
    if (!refreshToken) {
      this.authService.logout();
      return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
    }

    return this.http.post(`${this.authService.apiUrl}/account/refresh`, { refreshToken }).pipe(
      switchMap((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('accessTokenExpiration', res.accessTokenExpiration);

        const clonedReq = req.clone({
          setHeaders: { Authorization: `Bearer ${res.accessToken}` },
        });

        return next.handle(clonedReq);
      }),
      catchError(() => {
        this.authService.logout();
        return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
      })
    );
  }
}