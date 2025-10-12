import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private isAuthenticatedSignal = signal<boolean>(this.hasToken());

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    // Mock authentication - in a real app, this would call an API
    if (email && password) {
      const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem(this.TOKEN_KEY, mockToken);
      this.isAuthenticatedSignal.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSignal.set(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSignal();
  }

  getAuthenticatedSignal() {
    return this.isAuthenticatedSignal.asReadonly();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}