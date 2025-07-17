import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService } from '../../services/network.service';

@Component({
  selector: 'app-connection-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="!isOnline" class="connection-status error">
      <div class="connection-icon">⚠️</div>
      <div class="connection-message">You are currently offline</div>
    </div>
    <div *ngIf="isAIModelOverloaded" class="connection-status warning">
      <div class="connection-icon">🤖</div>
      <div class="connection-message">AI service is experiencing high load. Some features may be slower than usual.</div>
    </div>
  `,
  styles: [`
    .connection-status {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      color: white;
      padding: 8px;
      text-align: center;
      z-index: 1000;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
    }
    .error {
      background-color: #f44336;
    }
    .warning {
      background-color: #ff9800;
    }
    .connection-icon {
      margin-right: 8px;
    }
  `]
})
export class ConnectionStatusComponent implements OnInit {
  isOnline = true;
  isAIModelOverloaded = false;

  constructor(private networkService: NetworkService) {}

  ngOnInit(): void {
    // Check initial network status
    this.isOnline = this.networkService.isOnline();
    
    // Subscribe to network status changes
    this.networkService.getOnlineStatus().subscribe(online => {
      this.isOnline = online;
    });
    
    // Subscribe to AI model status
    this.networkService.getAIModelStatus().subscribe(status => {
      this.isAIModelOverloaded = status.isOverloaded;
      
      // Auto-hide the warning after 10 seconds if it's showing
      if (this.isAIModelOverloaded) {
        setTimeout(() => {
          this.isAIModelOverloaded = false;
        }, 10000);
      }
    });
  }
}