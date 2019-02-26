import { AuthenticationService } from './AuthenticationService';
import { LineChartData } from './../Models/LineChartData';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Configuration } from '../Models/Configuration';
import { LoggerService, EnumPriority } from './logger.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ConfigurationService {

  private configurationsUrl = 'http://127.0.0.1:8080/configuration/';  // URL to web api

  constructor(
    private http: HttpClient,
    private LoggerService: LoggerService,
    private authenticationService: AuthenticationService) { }

  /** GET Configurations from the server */
  getConfigurations (): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(this.configurationsUrl, {headers : this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        catchError(this.LoggerService.handleError('getConfigurations', EnumPriority.Major, []))
      );
  }

  /** GET Configuration by id. Return `undefined` when id not found */
  getConfigurationNo404<Data>(id: number): Observable<Configuration> {
    const url = `${this.configurationsUrl}/?id=${id}`;
    return this.http.get<Configuration[]>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        map(Configurations => Configurations[0]), // returns a {0|1} element array
        tap(h => {
          console.log(h ? `fetched` : `did not find`);
         }),
        catchError(this.LoggerService.handleError<Configuration>(`getConfiguration id=${id}`, EnumPriority.Major))
      );
  }

  /** GET Configuration by id. Will 404 if id not found */
  getConfiguration(id: number): Observable<Configuration> {
    const url = `${this.configurationsUrl}/${id}`;
    return this.http.get<Configuration>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.LoggerService.handleError<Configuration>(`getConfiguration id=${id}`, EnumPriority.Major))
    );
  }

  /* GET Configurations whose name contains search term */
  searchConfigurations(term: string): Observable<Configuration[]> {
    if (!term.trim()) {
      // if not search term, return all Configurations.
      return this.http.get<Configuration[]>(this.configurationsUrl, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
        
        catchError(this.LoggerService.handleError<Configuration[]>('searchConfiguration', EnumPriority.Major, []))
      );
    }
    return this.http.get<Configuration[]>(`${this.configurationsUrl}/?name=${term}`, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.LoggerService.handleError<any>('searchConfiguration', EnumPriority.Major))
    );
  }

  //////// Save methods //////////

  /** POST: add a new Configuration to the server */
  addConfiguration (configuration: Configuration): Observable<Configuration> {
    return this.http.post<Configuration>(this.configurationsUrl, Configuration, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
     catchError(this.LoggerService.handleError<any>('addConfiguration', EnumPriority.Major))
    );
  }

  /** DELETE: delete the Configuration from the server */
  deleteConfiguration (configuration: Configuration | number): Observable<Configuration> {
    const id = typeof configuration === 'number' ? configuration : configuration.id;
    const url = `${this.configurationsUrl}/${id}`;

    return this.http.delete<Configuration>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.LoggerService.handleError<any>('deleteConfiguration', EnumPriority.Major))
    );
  }

  /** PUT: update the Configuration on the server */
  updateConfiguration (configuration: Configuration): Observable<any> {
    return this.http.put(this.configurationsUrl, configuration, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.LoggerService.handleError<any>('updateConfiguration', EnumPriority.Major))
    );
  }



}
