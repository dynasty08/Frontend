import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RetryService {
  
  constructor() {}
  
  /**
   * Generic retry strategy for handling network errors
   * @param maxRetries Maximum number of retries
   * @param delayMs Delay between retries in milliseconds
   * @param excludedStatusCodes HTTP status codes that should not trigger retry
   */
  genericRetryStrategy = (
    maxRetries = environment.maxRetries || 3, 
    delayMs = environment.retryDelay || 2000, 
    excludedStatusCodes: number[] = []
  ) => (attempts: Observable<any>) => {
    return attempts.pipe(
      retryWhen(errors => 
        errors.pipe(
          mergeMap((error, i) => {
            const retryAttempt = i + 1;
            
            // If we've reached max retries or the error status code is in the excluded list, throw error
            if (
              retryAttempt > maxRetries || 
              (error.status && excludedStatusCodes.includes(error.status))
            ) {
              return throwError(() => error);
            }
            
            // For AI model high load errors, use exponential backoff
            let currentDelay = delayMs;
            if (this.isAIModelLoadError(error)) {
              console.log('AI model high load detected, using exponential backoff');
              currentDelay = delayMs * Math.pow(2, i);
            }
            
            console.log(`Attempt ${retryAttempt}: Retrying in ${currentDelay}ms`);
            
            // Retry after delay
            return timer(currentDelay);
          }),
          finalize(() => console.log('Retry completed'))
        )
      )
    );
  }
  
  /**
   * Check if the error is related to AI model high load
   */
  private isAIModelLoadError(error: any): boolean {
    // Check error message patterns that indicate AI model load issues
    const errorMsg = this.getErrorMessage(error);
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