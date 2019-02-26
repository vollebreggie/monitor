import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../Models/User';
import { LoggerService, EnumPriority } from './logger.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class UserService {

  private UsersUrl = 'api/Users';  // URL to web api

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService) { }

  /** GET Users from the server */
  getUsers (): Observable<User[]> {
    return this.http.get<User[]>(this.UsersUrl)
      .pipe(
        catchError(this.loggerService.handleError('getUser', EnumPriority.Major, []))
      );
  }

  /** GET User by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: number): Observable<User> {
    const url = `${this.UsersUrl}/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(Users => Users[0]), // returns a {0|1} element array
        tap(h => {
          console.log(h ? `fetched` : `did not find`);
         }),
        catchError(this.loggerService.handleError<User>(`getUser id=${id}`, EnumPriority.Major))
      );
  }

  /** GET User by id. Will 404 if id not found */
  getUser(id: number): Observable<User> {
    const url = `${this.UsersUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.loggerService.handleError<User>(`getUser id=${id}`, EnumPriority.Major))
    );
  }

  /* GET Users whose name contains search term */
  searchUsers(term: string): Observable<User[]> {
    if (!term.trim()) {
      // if not search term, return all Users.
      return this.http.get<User[]>(this.UsersUrl).pipe(
        
        catchError(this.loggerService.handleError<User[]>('searchUser', EnumPriority.Major, []))
      );
    }
    return this.http.get<User[]>(`${this.UsersUrl}/?name=${term}`).pipe(
      catchError(this.loggerService.handleError<any>('searchUser', EnumPriority.Major))
    );
  }

  //////// Save methods //////////

  /** POST: add a new User to the server */
  addUser (User: User): Observable<User> {
    return this.http.post<User>(this.UsersUrl, User, httpOptions).pipe(
     catchError(this.loggerService.handleError<any>('addUser', EnumPriority.Major))
    );
  }

  /** DELETE: delete the User from the server */
  deleteUser (User: User | number): Observable<User> {
    const id = typeof User === 'number' ? User : User.id;
    const url = `${this.UsersUrl}/${id}`;

    return this.http.delete<User>(url, httpOptions).pipe(
      catchError(this.loggerService.handleError<any>('deleteUser', EnumPriority.Major))
    );
  }

  /** PUT: update the User on the server */
  updateUser (User: User): Observable<any> {
    return this.http.put(this.UsersUrl, User, httpOptions).pipe(
      catchError(this.loggerService.handleError<any>('updateUser', EnumPriority.Major))
    );
  }



}
