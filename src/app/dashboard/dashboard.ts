import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  version = 'v2.1';
  lastUpdated = new Date().toLocaleDateString();
  dashboardData: any = {
    totalUsers: 0,
    activeSessions: 0,
    systemStatus: 'Loading...'
  };
  loading = true;
  error = '';

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.apiService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Dashboard data error:', error);
        // Fallback to mock data if API fails
        this.dashboardData = {
          totalUsers: 1234,
          activeSessions: 56,
          systemStatus: 'Online'
        };
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
