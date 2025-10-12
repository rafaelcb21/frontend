import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../infra/auth/auth.service';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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