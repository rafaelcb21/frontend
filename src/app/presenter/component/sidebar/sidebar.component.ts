import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent {
  @Input() expanded: boolean = true;
  @Output() expandedChange = new EventEmitter<boolean>();

  toggleSidebar() {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }
}