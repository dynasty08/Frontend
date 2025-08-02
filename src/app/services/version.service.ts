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
    // Add cache-busting parameter to force fresh version loading
    const cacheBuster = new Date().getTime();
    return this.http.get<VersionInfo>(`assets/version.json?v=${cacheBuster}`)
      .pipe(
        catchError(() => {
          // If JSON fails, try to load text version file
          return this.http.get('assets/version.txt', { responseType: 'text' })
            .pipe(
              map(text => {
                const versionLine = text.split('\n').find(line => line.startsWith('version:'));
                const version = versionLine ? versionLine.replace('version:', '').trim() : 'v2.1';
                return {
                  version: version,
                  buildDate: new Date().toLocaleString()
                };
              }),
              catchError(() => {
                console.log('Could not load any version file, using default version');
                return of(this.defaultVersion);
              })
            );
        })
      );
  }
}