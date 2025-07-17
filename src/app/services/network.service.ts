import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';

interface AIModelStatus {
  isOverloaded: boolean;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private online = new BehaviorSubject<boolean>(navigator.onLine);
  public online$ = this.online.asObservable();
  
  private aiModelStatus = new BehaviorSubject<AIModelStatus>({
    isOverloaded: false,
    lastUpdated: new Date()
  });
  public aiModelStatus$ = this.aiModelStatus.asObservable();

  constructor() {
    // Initialize with the current online status
    this.updateOnlineStatus();

    // Listen for online/offline events
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe(status => {
      this.updateOnlineStatus();
    });
  }

  private updateOnlineStatus(): void {
    this.online.next(navigator.onLine);
    console.log(`Network status: ${navigator.onLine ? 'online' : 'offline'}`);
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  getOnlineStatus(): Observable<boolean> {
    return this.online$;
  }
  
  /**
   * Report AI model overload status
   */
  reportAIModelOverload(isOverloaded: boolean): void {
    console.log(`AI model status: ${isOverloaded ? 'overloaded' : 'normal'}`);
    this.aiModelStatus.next({
      isOverloaded,
      lastUpdated: new Date()
    });
  }
  
  /**
   * Get AI model status as an observable
   */
  getAIModelStatus(): Observable<AIModelStatus> {
    return this.aiModelStatus$;
  }
}