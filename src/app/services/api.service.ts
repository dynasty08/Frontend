import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Authentication endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // Dashboard data endpoints
  getDashboardData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/dashboard`, { headers });
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/user/profile`, { headers });
  }

  // Helper method to add auth token to headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Generic API call method
  apiCall(method: string, endpoint: string, data?: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiUrl}${endpoint}`;

    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get(url, { headers });
      case 'post':
        return this.http.post(url, data, { headers });
      case 'put':
        return this.http.put(url, data, { headers });
      case 'delete':
        return this.http.delete(url, { headers });
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}