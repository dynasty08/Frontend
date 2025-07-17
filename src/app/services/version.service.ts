import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface VersionInfo {
  version: string;
  buildDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private defaultVersion: VersionInfo = {
    version: 'v2.1',
    buildDate: new Date().toISOString()
  };

  constructor(private http: HttpClient) {}

  getVersion(): Observable<VersionInfo> {
    return this.http.get<VersionInfo>('assets/version.json')
      .pipe(
        catchError(() => {
          console.log('Could not load version file, using default version');
          return of(this.defaultVersion);
        })
      );
  }
}