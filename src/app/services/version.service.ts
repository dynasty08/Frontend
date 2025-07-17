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
    // Try to load JSON version file first
    return this.http.get<VersionInfo>('assets/version.json')
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