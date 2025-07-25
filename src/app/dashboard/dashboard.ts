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
    
    // Set loading to false and provide default dashboard data
    this.loading = false;
    this.dashboardData = {
      totalUsers: 0,
      activeSessions: 12,
      systemStatus: 'Online'
    };
    console.log('Dashboard loaded successfully');
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
 const response = await fetch('https://twvn323zg6.execute-api.ap-southeast-1.amazonaws.com/dev/api/users');
 const result = await response.json();
 this.users = result.data || [];
 this.dashboardData.totalUsers = this.users.length;
   console.log('Users loaded:', this.users);
 } catch (error) {
 console.error('Error loading users:', error);
   this.error = 'Failed to load users';
     this.users = []; // Set empty array on error
    }
  }

  loadDatabaseInfo() {
    this.databaseLoading = true;
    this.databaseError = '';
    
    this.userService.getDatabaseInfo().subscribe({
      next: (data) => {
        this.databaseInfo = data;
        this.databaseLoading = false;
        console.log('Database info loaded:', data);
      },
      error: (error) => {
        console.error('Database info error:', error);
        this.databaseError = 'Failed to load database information';
        this.databaseLoading = false;
      }
    });
  }
}