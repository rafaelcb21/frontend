import { Component, EventEmitter, Output, HostListener, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@infra/auth/auth.service';
import { ThemeService } from '@infra/theme/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.sass']
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  private screenWidth: number = window.innerWidth;
  
  private readonly themeService = inject(ThemeService);
  isDark = computed(() => this.themeService.theme() === 'dark');
  
  constructor(private authService: AuthService) {}
  
  @HostListener('window:resize')
  onResize() {
    this.screenWidth = window.innerWidth;
  }
  
  isMobile(): boolean {
    return this.screenWidth < 768;
  }
  
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
  
  logout(): void {
    this.authService.logout();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}