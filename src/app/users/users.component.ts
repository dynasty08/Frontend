import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = false;
  error = '';
  isOnline = true;

  constructor(
    private userService: UserService,
    private networkService: NetworkService
  ) {}

  ngOnInit(): void {
    // Check network status
    this.isOnline = this.networkService.isOnline();
    this.networkService.getOnlineStatus().subscribe(online => {
      this.isOnline = online;
      if (online && this.users.length === 0) {
        this.loadUsers();
      }
    });

    // Load users if online
    if (this.isOnline) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error = typeof err === 'string' ? err : 'Failed to load users';
        this.loading = false;
      }
    });
  }

  refreshUsers(): void {
    if (this.isOnline) {
      this.loadUsers();
    }
  }
}