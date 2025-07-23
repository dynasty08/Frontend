import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { VersionService } from '../services/version.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  // Hardcode the version to ensure it's visible
  version = 'v3.0-MANUAL-UPDATE';
  lastUpdated = new Date().toLocaleString();
  dashboardData: any = {
    totalUsers: 0,
    activeSessions: 0,
    systemStatus: 'Loading...'
  };
  loading = true;
  error = '';
  users: any[] = [];

  constructor(
    private router: Router, 
    private apiService: ApiService,
    private versionService: VersionService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadVersionInfo();
    this.loadUsers();
  }
  
  loadVersionInfo() {
    this.versionService.getVersion().subscribe(versionInfo => {
      this.version = versionInfo.version;
      this.lastUpdated = versionInfo.buildDate;
    });
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

  loadUsers() {
    // Import UserService and inject in constructor for real use
    // For now, use ApiService if UserService is not imported
    if ((this.apiService as any).getAllUsers) {
      (this.apiService as any).getAllUsers().subscribe({
        next: (users: any[]) => {
          this.users = users;
        },
        error: (error: any) => {
          console.error('Error loading users:', error);
          this.error = 'Failed to load users';
        }
      });
    }
  }
}