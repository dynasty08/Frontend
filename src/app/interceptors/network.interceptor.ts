import { Injectable } from '@angular/core';
import { 
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor,
  HttpErrorResponse 
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NetworkService } from '../services/network.service';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {
  
  constructor(private networkService: NetworkService) {}
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = '';
          
          // Check for AI model high load errors
          if (this.isAIModelLoadError(error)) {
            console.warn('AI model high load detected in interceptor');
            this.networkService.reportAIModelOverload(true);
            errorMsg = 'AI service is currently experiencing high load. Please try again later.';
          } else if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMsg = `Error: ${error.error.message}`;
          } else {
            // Server-side error
            if (error.status === 0) {
              // This is likely an ECONNRESET or network error
              console.error('Network error detected:', error);
              errorMsg = 'Network connection error. Please check your internet connection.';
            } else if (error.status === 429) {
              // Rate limiting - could be AI model related
              this.networkService.reportAIModelOverload(true);
              errorMsg = 'Too many requests. Please try again later.';
            } else {
              errorMsg = `Error Code: ${error.status}, Message: ${error.message}`;
            }
          }
          
          return throwError(() => errorMsg);
        })
      );
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