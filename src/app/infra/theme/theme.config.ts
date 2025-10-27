import { InjectionToken } from '@angular/core';

export interface Theme {
  name: string;
  class: string;
}

export const THEMES = new InjectionToken<Theme[]>('app.themes');
export const DEFAULT_THEME = new InjectionToken<Theme>('app.default_theme');

export const defaultThemes: Theme[] = [
  { name: 'Light', class: 'light-theme' },
  { name: 'Dark', class: 'dark-theme' }
];