import { Injectable, signal } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'app.theme';
  theme = signal<AppTheme>('dark');

  constructor() {
    const saved = (localStorage.getItem(this.storageKey) as AppTheme) || 'dark';
    this.theme.set(saved);
    this.applyTheme(saved);
  }

  toggle(): void {
    const next: AppTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  setTheme(value: AppTheme): void {
    this.theme.set(value);
    localStorage.setItem(this.storageKey, value);
    this.applyTheme(value);
  }

  private applyTheme(value: AppTheme): void {
    const root = document.documentElement; // <html>
    root.classList.remove('dark-theme', 'light-theme');
    root.classList.add(value === 'dark' ? 'dark-theme' : 'light-theme');
  }

  getCssVar(name: string): string {
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(name).trim();
  }
}