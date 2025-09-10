import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { VersionService } from '../services/version.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  // Dynamic version from build
  version = 'Loading...';
  lastUpdated = 'Loading...';
  dashboardData: any = {
    totalUsers: 0,
    activeSessions: 0,
    systemStatus: 'Loading...'
  };
  loading = true;
  error = '';
  users: any[] = [];
  showUsers = false;
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
    this.loadVersionInfo();
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
    this.versionService.getVersion().subscribe({
      next: (versionInfo) => {
        this.version = versionInfo.version;
        this.lastUpdated = versionInfo.buildDate;
      },
      error: (error) => {
        console.error('Version load error:', error);
        this.version = 'v3.1-local';
        this.lastUpdated = new Date().toLocaleString();
      }
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

  loadUsers() {
    const sanitize = (input: any) => typeof input === 'string' ? input.replace(/[\r\n\t]/g, '_') : JSON.stringify(input).replace(/[\r\n\t]/g, '_');
    try {
      this.userService.getAllUsers().subscribe({
        next: (result) => {
          console.log('Users API Response received');
          this.users = result.users || result.data || [];
          this.dashboardData.totalUsers = this.users.length;
          this.error = '';
          console.log('Users loaded:', this.users.length, 'users');
        },
        error: (error) => {
          console.error('Error loading users:', sanitize(error.message || 'Unknown error'));
          this.error = 'Failed to load users';
          this.users = [];
          this.dashboardData.totalUsers = 0;
        }
      });
    } catch (error: any) {
      console.error('Error loading users:', sanitize(error.message || 'Unknown error'));
      this.error = 'Failed to load users';
      this.users = [];
      this.dashboardData.totalUsers = 0;
    }
  }

  loadDatabaseInfo() {
    const sanitize = (input: any) => typeof input === 'string' ? input.replace(/[\r\n\t]/g, '_') : JSON.stringify(input).replace(/[\r\n\t]/g, '_');
    this.databaseLoading = true;
    this.databaseError = '';
    
    try {
      this.userService.getDatabaseInfo().subscribe({
        next: (data) => {
          console.log('Database API Response received');
          this.databaseInfo = data;
          this.databaseLoading = false;
          this.databaseError = '';
        },
        error: (error) => {
          console.error('Database info error:', sanitize(error.message || 'Unknown error'));
          this.databaseError = 'Failed to load database information';
          this.databaseLoading = false;
          this.databaseInfo = null;
        }
      });
    } catch (error: any) {
      console.error('Database info error:', sanitize(error.message || 'Unknown error'));
      this.databaseError = 'Failed to load database information';
      this.databaseLoading = false;
      this.databaseInfo = null;
    }
  }

  loadActiveSessions() {
    const sanitize = (input: any) => typeof input === 'string' ? input.replace(/[\r\n\t]/g, '_') : JSON.stringify(input).replace(/[\r\n\t]/g, '_');
    try {
      this.apiService.apiCall('get', '/active-sessions').subscribe({
        next: (data) => {
          console.log('Active Sessions API Response received');
          if (data.success) {
            this.dashboardData.activeSessions = data.activeSessions;
          } else {
            this.dashboardData.activeSessions = 0;
          }
        },
        error: (error) => {
          console.error('Active sessions error:', sanitize(error.message || 'Unknown error'));
          this.dashboardData.activeSessions = 0;
        }
      });
    } catch (error: any) {
      console.error('Active sessions error:', sanitize(error.message || 'Unknown error'));
      this.dashboardData.activeSessions = 0;
    }
  }

  toggleUsers() {
    this.showUsers = !this.showUsers;
  }
}