import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = environment.apiUrl;
  private apiTimeout = environment.apiTimeout || 10000;

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  /**
   * Get PostgreSQL database data
   */
  getDatabaseData(): Observable<any> {
    const headers = this.apiService.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/database`, { headers })
      .pipe(
        timeout(this.apiTimeout),
        catchError(error => this.apiService.handleError(error))
      );
  }
}