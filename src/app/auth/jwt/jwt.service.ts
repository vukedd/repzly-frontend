// jwt.service.ts
import { Injectable } from '@angular/core';
import { API_URL } from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { LoginRequestDto } from '../../user/login/dtos/login-request-dto';
import { EMPTY, Observable, throwError, BehaviorSubject } from 'rxjs';
import { Token } from '../token';
import { RefreshTokenRequest } from '../refresh-token-request';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private authStateInitialized = false;
  private loggedInSubject = new BehaviorSubject<boolean | null>(null); // Start with null to indicate not initialized
  public authState$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    // We'll initialize auth state via provideAppInitializer instead
  }

  // Make this public so it can be called by provideAppInitializer
  public initAuthState(): void {
    // This function will be called before the app renders
    // Get token synchronously
    const token = this.getToken();

    if (token) {
      try {
        const decoded = this.decodeToken(token);
        if (decoded) {
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp && decoded.exp > currentTime) {
            this.loggedInSubject.next(true);
          } else {
            // Token expired
            this.logout();
          }
        } else {
          this.logout();
        }
      } catch (e) {
        this.logout();
      }
    } else {
      this.loggedInSubject.next(false);
    }

    this.authStateInitialized = true;
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      this.loggedInSubject.next(false);
    }
  }

  sendLoginRequest(request: LoginRequestDto): Observable<any> {
    return this.http.post(API_URL + "/auth/login", request);
  }

  refreshToken(): Observable<any> {
    let refreshTokenId: any = "";
    if (typeof window !== 'undefined' && window.sessionStorage) {
      refreshTokenId = sessionStorage.getItem("refreshToken");
    } else {
      return EMPTY;
    }
    if (refreshTokenId == null) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }
    let body: RefreshTokenRequest = new RefreshTokenRequest(Number(refreshTokenId));
    return this.http.post(API_URL + "/auth/refresh-token", body);
  }

  isLoggedIn(): boolean {
    // Return the current value synchronously, but consider null as not logged in
    return this.loggedInSubject.value === true;
  }


  isAuthInitialized(): boolean {
    return this.loggedInSubject.value !== null;
  }

  getLoggedInUser(): Observable<any> {
    let token: string | null = this.getToken();
    let decodedToken = null;
    let username = null;
    if (token != null) {
      decodedToken = jwtDecode(token);
      username = decodedToken.sub;
    }
    return this.http.get(API_URL + "/user/me?username=" + username);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem("accessToken");
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return sessionStorage.getItem("refreshToken");
    }
    return null;
  }

  setTokens(token: Token) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem("accessToken", token.accessToken);
      sessionStorage.setItem("refreshToken", token.refreshToken);
      this.loggedInSubject.next(true);
    }
  }

  decodeToken(token: string) {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }
}