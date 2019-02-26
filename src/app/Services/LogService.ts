import { AuthenticationService } from './AuthenticationService';
import { LineChartData } from './../Models/LineChartData';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Log } from '../Models/Log';
import { LoggerService, EnumPriority } from './logger.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class LogService {

  private LogsUrl = 'http://127.0.0.1:8080/log';  // URL to web api

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService,
    private authenticationService: AuthenticationService) { }

  /** GET LineChartData from the server */
  getLineChartData (systemId: number, priority: EnumPriority): Observable<LineChartData> {
    const url = `${this.LogsUrl}/${systemId}/${priority}/`;
    return this.http.get<LineChartData>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        catchError(this.loggerService.handleError<LineChartData>(`getLog systemId=${systemId} & priority=${priority}`, EnumPriority.Major))
      );
  }

  /** GET Log by id. Return `undefined` when id not found */
  getLogNo404<Data>(id: number): Observable<Log> {
    const url = `${this.LogsUrl}/?id=${id}`;
    return this.http.get<Log[]>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        map(Logs => Logs[0]), // returns a {0|1} element array
        tap(h => {
          console.log(h ? `fetched` : `did not find`);
         }),
        catchError(this.loggerService.handleError<Log>(`getLog id=${id}`, EnumPriority.Major))
      );
  }

  /** GET Log by id. Will 404 if id not found */
  getLog(id: number): Observable<Log> {
    const url = `${this.LogsUrl}/${id}`;
    return this.http.get<Log>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<Log>(`getLog id=${id}`, EnumPriority.Major))
    );
  }

  /* GET Logs whose name contains search term */
  searchLogs(term: string): Observable<Log[]> {
    if (!term.trim()) {
      // if not search term, return all Logs.
      return this.http.get<Log[]>(this.LogsUrl, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
        
        catchError(this.loggerService.handleError<Log[]>('searchLog', EnumPriority.Major, []))
      );
    }
    return this.http.get<Log[]>(`${this.LogsUrl}/?name=${term}`, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('searchLog', EnumPriority.Major))
    );
  }

  //////// Save methods //////////

  /** POST: add a new Log to the server */
  addLog (Log: Log): Observable<Log> {
    return this.http.post<Log>(this.LogsUrl, Log, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
     catchError(this.loggerService.handleError<any>('addLog', EnumPriority.Major))
    );
  }

  /** DELETE: delete the Log from the server */
  deleteLog (Log: Log | number): Observable<Log> {
    const id = typeof Log === 'number' ? Log : Log.id;
    const url = `${this.LogsUrl}/${id}`;

    return this.http.delete<Log>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('deleteLog', EnumPriority.Major))
    );
  }

  /** PUT: update the Log on the server */
  updateLog (Log: Log): Observable<any> {
    return this.http.put(this.LogsUrl, Log, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('updateLog', EnumPriority.Major))
    );
  }



}
