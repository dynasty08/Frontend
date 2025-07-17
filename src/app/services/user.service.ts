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
}