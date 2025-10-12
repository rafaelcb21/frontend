import { Component, EventEmitter, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../infra/auth/auth.service';

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
}