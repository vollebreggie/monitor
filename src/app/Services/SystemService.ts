import { AuthenticationService } from './AuthenticationService';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { System } from '../Models/System';
import { LoggerService, EnumPriority } from './logger.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class SystemService {

  private SystemsUrl = 'http://127.0.0.1:8080/system/';  // URL to web api
 

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService,
    private authenticationService: AuthenticationService) {
      
     }

  /** GET Systems from the server */
  getSystems (): Observable<System[]> {
    return this.http.get<System[]>(this.SystemsUrl, { headers : this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        catchError(this.loggerService.handleError('getSystem', EnumPriority.Major, []))
      );
  }

    /** GET Systems from the server */
    getSystemsByUserId (): Observable<System[]> {
      return this.http.get<System[]>(`${this.SystemsUrl}?user_id=${this.authenticationService.currentUserValue.id}`, { headers : this.authenticationService.getHttpHeaderWithToken().headers })
        .pipe(
          catchError(this.loggerService.handleError('getSystem', EnumPriority.Major, []))
        );
    }

  /** GET System by id. Return `undefined` when id not found */
  getSystemNo404<Data>(id: number): Observable<System> {
    const url = `${this.SystemsUrl}/?id=${id}`;
    return this.http.get<System[]>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        map(Systems => Systems[0]), // returns a {0|1} element array
        tap(h => {
          console.log(h ? `fetched` : `did not find`);
         }),
        catchError(this.loggerService.handleError<System>(`getSystem id=${id}`, EnumPriority.Major))
      );
  }

  /** GET System by id. Will 404 if id not found */
  getSystem(id: number): Observable<System> {
    const url = `${this.SystemsUrl}/${id}`;
    return this.http.get<System>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers })
    .pipe(
      catchError(this.loggerService.handleError<System>(`getSystem id=${id}`, EnumPriority.Major))
    );
  }

  /* GET Systems whose name contains search term */
  searchSystems(term: string): Observable<System[]> {
    if (!term.trim()) {
      // if not search term, return all Systems.
      return this.http.get<System[]>(this.SystemsUrl, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
        
        catchError(this.loggerService.handleError<System[]>('searchSystem', EnumPriority.Major, []))
      );
    }
    return this.http.get<System[]>(`${this.SystemsUrl}/?name=${term}`).pipe(
      catchError(this.loggerService.handleError<any>('searchSystem', EnumPriority.Major))
    );
  }

  //////// Save methods //////////

  /** POST: add a new System to the server */
  addSystem (System: System): Observable<System> {
    return this.http.post<System>(this.SystemsUrl, System, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
     catchError(this.loggerService.handleError<any>('addSystem', EnumPriority.Major))
    );
  }

  /** DELETE: delete the System from the server */
  deleteSystem (System: System | number): Observable<System> {
    const id = typeof System === 'number' ? System : System.id;
    const url = `${this.SystemsUrl}/${id}`;

    return this.http.delete<System>(url, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('deleteSystem', EnumPriority.Major))
    );
  }

  /** PUT: update the System on the server */
  updateSystem (System: System): Observable<any> {
    return this.http.put(this.SystemsUrl, System, {headers : this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('updateSystem', EnumPriority.Major))
    );
  }



}
