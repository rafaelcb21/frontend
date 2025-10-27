import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@infra/auth/auth.service';
import { ThemeService } from '@infra/theme/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  showPassword: boolean = false;
  
  private readonly themeService = inject(ThemeService);
  isDark = computed(() => this.themeService.theme() === 'dark');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  onSubmit(): void {
    if (this.email && this.password) {
      const success = this.authService.login(this.email, this.password);
      
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Credenciais inválidas. Tente novamente.';
      }
    } else {
      this.error = 'Por favor, preencha todos os campos.';
    }
  }
}