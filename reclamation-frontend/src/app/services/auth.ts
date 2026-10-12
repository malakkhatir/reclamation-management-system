import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'jwt_token';
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    const token = this.getToken();
    if (token) {
      this.loadUserFromToken(token);
    }
  }

  register(user: { nom: string; email: string; password: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/register`, user, { responseType: 'text' });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      ...credentials,
      email: credentials.email.trim().toLowerCase()
    }).pipe(
      tap(response => {
        if (response.token) {
          this.setToken(response.token);
          this.loadUserFromToken(response.token);
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.tokenKey)
      : null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  isLoggedIn(): boolean {
    // Un token expiré ou mal formé ne doit jamais autoriser l'accès aux routes protégées.
    return this.getUserRole() !== null;
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = this.decodeToken(token);
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        this.logout();
        return null;
      }
      const authorities = payload.authorities || payload.roles || [];
      const normalized = Array.isArray(authorities) ? authorities : [authorities];
      if (normalized.includes('ROLE_AGENT') || normalized.includes('AGENT')) {
        return 'AGENT';
      }
      if (normalized.includes('ROLE_CLIENT') || normalized.includes('CLIENT')) {
        return 'CLIENT';
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  private loadUserFromToken(token: string): void {
    try {
      const payload = this.decodeToken(token);
      this.currentUserSubject.next({
        email: payload.sub,
        role: this.getUserRole()
      });
    } catch (e) {
      this.logout();
    }
  }

  private decodeToken(token: string): any {
    const encodedPayload = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    return JSON.parse(atob(encodedPayload));
  }
}
