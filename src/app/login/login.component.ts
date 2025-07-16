import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    // Simple validation - replace with real authentication
    if (this.email === 'admin@test.com' && this.password === 'password') {
      localStorage.setItem('isLoggedIn', 'true');
      alert('Login successful!');
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }
}
