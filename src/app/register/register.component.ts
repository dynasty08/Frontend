import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';
  name = '';
  errorMessage = '';
  successMessage = '';
  isOnline = true;

  constructor(
    private router: Router, 
    private apiService: ApiService,
    private networkService: NetworkService
  ) {}
  
  ngOnInit(): void {
    // Check initial network status
    this.isOnline = this.networkService.isOnline();
    
    // Subscribe to network status changes
    this.networkService.getOnlineStatus().subscribe(online => {
      this.isOnline = online;
      if (!online) {
        this.errorMessage = 'You are currently offline. Please check your internet connection.';
      } else if (this.errorMessage && this.errorMessage.includes('offline')) {
        this.errorMessage = '';
      }
    });
  }

  onSubmit() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validate form
    if (!this.email || !this.password || !this.confirmPassword || !this.name) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    
    // Check if we're online before making the API call
    if (!this.isOnline) {
      this.errorMessage = 'You are currently offline. Please check your internet connection.';
      return;
    }
    
    // Call API for registration
    const userData = {
      email: this.email,
      password: this.password,
      name: this.name
    };
    
    this.apiService.register(userData).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! You can now log in.';
        // Clear form
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.name = '';
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        
        // Check if it's a connection error
        if (typeof error === 'string') {
          if (error.includes('Connection error')) {
            this.errorMessage = 'Cannot connect to server. Please check your internet connection.';
          } else if (error.includes('API Gateway error')) {
            this.errorMessage = 'The registration service is temporarily unavailable. Please try again later.';
          } else if (error.includes('timeout')) {
            this.errorMessage = 'The server is taking too long to respond. Please try again later.';
          } else if (error.includes('already exists') || error.includes('duplicate')) {
            this.errorMessage = 'This email is already registered. Please use a different email or try logging in.';
          } else {
            this.errorMessage = error;
          }
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
  
  goToLogin() {
    this.router.navigate(['/login']);
  }
}