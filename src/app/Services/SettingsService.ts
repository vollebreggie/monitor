import { AuthenticationService } from './AuthenticationService';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Setting } from '../Models/Setting';
import { LoggerService, EnumPriority } from './logger.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class SettingService {

  private SettingsUrl = 'http://127.0.0.1:8080/setting/';  // URL to web api
  private httpOptions: any;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService,
    private authenticationService: AuthenticationService) {
      
     }

  /** GET Settings from the server */
  getSettings (): Observable<Setting[]> {
    return this.http.get<Setting[]>(this.SettingsUrl, { headers: this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        catchError(this.loggerService.handleError('getSetting', EnumPriority.Major, []))
      );
  }

  /** GET Setting by id. Return `undefined` when id not found */
  getSettingNo404<Data>(id: number): Observable<Setting> {
    const url = `${this.SettingsUrl}/?id=${id}`;
    return this.http.get<Setting[]>(url, { headers: this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        map(Settings => Settings[0]), // returns a {0|1} element array
        tap(h => {
          console.log(h ? `fetched` : `did not find`);
         }),
        catchError(this.loggerService.handleError<Setting>(`getSetting id=${id}`, EnumPriority.Major))
      );
  }

  /** GET Setting by id. Will 404 if id not found */
  getSetting(id: number): Observable<Setting> {
    const url = `${this.SettingsUrl}/${id}`;
    return this.http.get<Setting>(url, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<Setting>(`getSetting id=${id}`, EnumPriority.Major))
    );
  }

  /* GET Settings whose name contains search term */
  searchSettings(term: string): Observable<Setting[]> {
    if (!term.trim()) {
      // if not search term, return all Settings.
      return this.http.get<Setting[]>(this.SettingsUrl, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
        
        catchError(this.loggerService.handleError<Setting[]>('searchSetting', EnumPriority.Major, []))
      );
    }
    return this.http.get<Setting[]>(`${this.SettingsUrl}/?name=${term}`, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('searchSetting', EnumPriority.Major))
    );
  }

  //////// Save methods //////////

  /** POST: add a new Setting to the server */
  addSetting (Setting: Setting): Observable<Setting> {
    return this.http.post<Setting>(this.SettingsUrl, Setting, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
     catchError(this.loggerService.handleError<any>('addSetting', EnumPriority.Major))
    );
  }

  /** DELETE: delete the Setting from the server */
  deleteSetting (Setting: Setting | number): Observable<Setting> {
    const id = typeof Setting === 'number' ? Setting : Setting.id;
    const url = `${this.SettingsUrl}/${id}`;

    return this.http.delete<Setting>(url, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('deleteSetting', EnumPriority.Major))
    );
  }

  /** PUT: update the Setting on the server */
  updateSetting (Setting: Setting): Observable<any> {
    return this.http.put(this.SettingsUrl, Setting, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('updateSetting', EnumPriority.Major))
    );
  }



}
