import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '@component/sidebar/sidebar.component';
import { TopbarComponent } from '@component/topbar/topbar.component';
import { ThemeService } from '@infra/theme/theme.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.sass']
})
export class ShellComponent {
  sidebarExpanded = signal<boolean>(true);
  private readonly themeService = inject(ThemeService);
  
  toggleSidebar(): void {
    this.sidebarExpanded.update(value => !value);
  }
}