import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
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
  // Set version to current build
  version = 'v3.1';
  lastUpdated = new Date().toLocaleString();
  dashboardData: any = {
    totalUsers: 0,
    activeSessions: 0,
    systemStatus: 'Loading...'
  };
  loading = true;
  error = '';
  users: any[] = [];
  databaseInfo: any = null;
  databaseLoading = false;
  databaseError = '';

  constructor(
    private router: Router, 
    private apiService: ApiService,
    private userService: UserService,
    private versionService: VersionService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadDatabaseInfo();
    this.loadActiveSessions();
    
    // Set default dashboard data
    this.dashboardData = {
      totalUsers: 0,
      activeSessions: 0,
      systemStatus: 'Online'
    };
    this.loading = false;
    console.log('Dashboard initialized');
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
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

  async loadUsers() {
    try {
      const response = await fetch('https://mrshckarmg.execute-api.ap-southeast-1.amazonaws.com/dev/users');
      const result = await response.json();
      console.log('Users API Response:', result);
      
      this.users = result.users || result.data || [];
      this.dashboardData.totalUsers = this.users.length;
      this.error = '';
      console.log('Users loaded:', this.users.length, 'users');
    } catch (error) {
      console.error('Error loading users:', error);
      this.error = 'Failed to load users';
      this.users = [];
      this.dashboardData.totalUsers = 0;
    }
  }

  async loadDatabaseInfo() {
    this.databaseLoading = true;
    this.databaseError = '';
    
    try {
      const response = await fetch('https://mrshckarmg.execute-api.ap-southeast-1.amazonaws.com/dev/database');
      const data = await response.json();
      console.log('Database API Response:', data);
      
      this.databaseInfo = data;
      this.databaseLoading = false;
      this.databaseError = '';
    } catch (error) {
      console.error('Database info error:', error);
      this.databaseError = 'Failed to load database information';
      this.databaseLoading = false;
      this.databaseInfo = null;
    }
  }

  async loadActiveSessions() {
    try {
      const response = await fetch('https://mrshckarmg.execute-api.ap-southeast-1.amazonaws.com/dev/active-sessions');
      const data = await response.json();
      console.log('Active Sessions API Response:', data);
      
      if (data.success) {
        this.dashboardData.activeSessions = data.activeSessions;
      } else {
        this.dashboardData.activeSessions = 0;
      }
    } catch (error) {
      console.error('Active sessions error:', error);
      this.dashboardData.activeSessions = 0;
    }
  }
}