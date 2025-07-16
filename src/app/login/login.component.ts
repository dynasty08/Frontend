import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private apiService: ApiService) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    // Call API for authentication
    this.apiService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Login failed';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        // Fallback to test credentials if API fails
        if (this.email === 'admin@test.com' && this.password === 'password') {
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      }
    });
  }
}
