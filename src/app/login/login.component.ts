import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  isOnline = true;
  isLoading = false;

  constructor(
    private router: Router, 
    private apiService: ApiService,
    private networkService: NetworkService
  ) {}
  
  ngOnInit(): void {
    this.isOnline = true;
    
    // Check if already logged in and redirect
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/dashboard']);
      return;
    }
  }
  
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    
    this.errorMessage = '';
    this.isLoading = true;
    
    // Check if we're online before making the API call
    if (!this.isOnline) {
      this.isLoading = false;
      this.errorMessage = 'You are currently offline. Please check your internet connection.';
      return;
    }
    
    // Call API for authentication
    this.apiService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('isLoggedIn', 'true');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        const sanitize = (input: any) => typeof input === 'string' ? input.replace(/[\r\n\t]/g, '_') : JSON.stringify(input).replace(/[\r\n\t]/g, '_');
        console.error('Login error:', sanitize(error.message || 'Unknown error'));
        
        // Handle HTTP error responses
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.status === 400) {
          this.errorMessage = 'Please fill in all required fields.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
        } else if (error.status >= 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}
