import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { RetryService } from './retry.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  private apiTimeout = environment.apiTimeout || 10000;

  constructor(private http: HttpClient, private retryService: RetryService) {}

  // Authentication endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        timeout(this.apiTimeout),
        catchError(error => {
          // For login, preserve the original error structure for proper handling
          if (error.status === 401 || error.status === 400) {
            return throwError(() => error);
          }
          return this.handleError(error);
        })
      );
  }

  register(userData: any): Observable<any> {
    const sanitize = (input: any) => typeof input === 'string' ? input.replace(/[\r\n\t]/g, '_') : JSON.stringify(input).replace(/[\r\n\t]/g, '_');
    console.log('Calling registration API:', `${this.apiUrl}/register`);
    console.log('Registration initiated');
    
    return this.http.post(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    })
      .pipe(
        timeout(this.apiTimeout),
        catchError(error => {
          const sanitize = (input: any) => typeof input === 'string' ? input.replace(/[\r\n\t]/g, '_') : JSON.stringify(input).replace(/[\r\n\t]/g, '_');
          console.error('Registration API error:', sanitize(error.message || 'Unknown error'));
          return this.handleError(error);
        })
      );
  }

  // Dashboard data endpoints
  getDashboardData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/dashboard`, { headers })
      .pipe(
        timeout(this.apiTimeout),
        this.retryService.genericRetryStrategy(3, 1000),
        catchError(error => this.handleError(error))
      );
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/user/profile`, { headers })
      .pipe(
        timeout(this.apiTimeout),
        this.retryService.genericRetryStrategy(3, 1000),
        catchError(error => this.handleError(error))
      );
  }

  // Helper method to add auth token to headers
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return new HttpHeaders(headers);
  }

  // Generic API call method
  apiCall(method: string, endpoint: string, data?: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}${endpoint}`;

    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get(url, { headers }).pipe(
          timeout(this.apiTimeout), 
          this.retryService.genericRetryStrategy(3, 1000), 
          catchError(error => this.handleError(error))
        );
      case 'post':
        return this.http.post(url, data, { headers }).pipe(
          timeout(this.apiTimeout), 
          this.retryService.genericRetryStrategy(3, 1000), 
          catchError(error => this.handleError(error))
        );
      case 'put':
        return this.http.put(url, data, { headers }).pipe(
          timeout(this.apiTimeout), 
          this.retryService.genericRetryStrategy(3, 1000), 
          catchError(error => this.handleError(error))
        );
      case 'delete':
        return this.http.delete(url, { headers }).pipe(
          timeout(this.apiTimeout), 
          this.retryService.genericRetryStrategy(3, 1000), 
          catchError(error => this.handleError(error))
        );
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
  
  // Error handling method
  handleError = (error: any) => {
    let errorMessage = '';
    
    const sanitize = (input: any) => typeof input === 'string' ? input.replace(/[\r\n\t]/g, '_') : JSON.stringify(input).replace(/[\r\n\t]/g, '_');
    
    // Check for specific ECONNRESET error
    if (error.message && error.message.includes('ECONNRESET')) {
      errorMessage = 'Connection reset: The server closed the connection unexpectedly. Please try again.';
      console.error('ECONNRESET error detected');
      return throwError(() => errorMessage);
    }
    
    // Check for AI model high load errors
    if (this.isAIModelLoadError(error)) {
      errorMessage = 'AI service is currently experiencing high load. Please try again later.';
      console.error('AI model high load error detected');
      return throwError(() => ({ message: errorMessage, isAILoadError: true }));
    }
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.name === 'TimeoutError') {
      // Timeout error
      errorMessage = 'Connection timeout: The server is taking too long to respond.';
      console.error('Request timeout error');
    } else {
      // Server-side error
      if (error.status === 0 && error.name === 'HttpErrorResponse') {
        // This typically includes network errors
        errorMessage = 'Connection error: The server is unreachable. Please check your network connection.';
        console.error('Network error detected');
      } else if (
        // Check for API Gateway errors in different formats
        (error.error && error.error.message && error.error.message.includes('unexpected error')) ||
        (error.message && error.message.includes('unexpected error')) ||
        (error.error && typeof error.error === 'string' && error.error.includes('unexpected error')) ||
        (error.status === 502 || error.status === 503 || error.status === 504)
      ) {
        // Handle API Gateway generic errors
        errorMessage = 'AWS API Gateway error: The service is temporarily unavailable. Please try again later.';
        console.error('API Gateway error detected');
        // Log the request ID if available
        if (error.error && error.error.requestId) {
          console.error('Request ID:', sanitize(error.error.requestId));
        }
      } else if (error.status === 429) {
        // Too many requests error
        errorMessage = 'Too many requests: The service is rate limited. Please try again later.';
        console.error('Rate limit error detected');
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error('API Error:', sanitize(errorMessage));
    return throwError(() => errorMessage);
  }
  
  /**
   * Check if the error is related to AI model high load
   */
  private isAIModelLoadError(error: any): boolean {
    // Extract error message from different possible formats
    const errorMsg = this.getErrorMessage(error);
    
    // Check for common AI model load error patterns
    return errorMsg.includes('model') && 
           (errorMsg.includes('high load') || 
            errorMsg.includes('capacity') || 
            errorMsg.includes('rate limit') ||
            errorMsg.includes('too many requests'));
  }
  
  /**
   * Extract error message from different error formats
   */
  private getErrorMessage(error: any): string {
    if (!error) return '';
    
    if (typeof error === 'string') return error;
    
    if (error.message) return error.message;
    
    if (error.error) {
      if (typeof error.error === 'string') return error.error;
      if (error.error.message) return error.error.message;
    }
    
    return JSON.stringify(error);
  }
}