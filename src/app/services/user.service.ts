import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private apiTimeout = environment.apiTimeout || 10000;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  /**
   * Get all users from the database
   */
  getAllUsers(): Observable<any> {
    const headers = this.apiService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users`, { headers })
      .pipe(
        timeout(this.apiTimeout),
        catchError(error => this.apiService.handleError(error))
      );
  }

  /**
   * Get a specific user by ID
   */
  getUserById(userId: string): Observable<any> {
    const headers = this.apiService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/${userId}`, { headers })
      .pipe(
        timeout(this.apiTimeout),
        catchError(error => this.apiService.handleError(error))
      );
  }

  /**
   * Get PostgreSQL database information
   */
  getDatabaseInfo(): Observable<any> {
    // Try real database first, fallback to mock data if it fails
    return this.http.get(`${this.apiUrl}/database`)
      .pipe(
        timeout(30000), // 30 seconds for database connection
        catchError(error => {
          const sanitize = (input: any) => typeof input === 'string' ? input.replace(/[\r\n\t]/g, '_') : JSON.stringify(input).replace(/[\r\n\t]/g, '_');
          console.error('Real database API error, trying fallback:', sanitize(error.message || 'Unknown error'));
          // Fallback to mock data if real database fails
          return this.http.get(`${this.apiUrl}/test-database`)
            .pipe(
              timeout(this.apiTimeout),
              catchError(fallbackError => {
                console.error('Fallback database API error:', sanitize(fallbackError.message || 'Unknown error'));
                return this.apiService.handleError(fallbackError);
              })
            );
        })
      );
  }
}