import { AuthenticationService } from './AuthenticationService';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Message } from '../Models/Message';
import { LoggerService, EnumPriority } from './logger.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class MessageService {

  private MessagesUrl = 'http://127.0.0.1:8080/message/';  // URL to web api
  private httpOptions: any;

  constructor(
    private http: HttpClient,
    private loggerService: LoggerService,
    private authenticationService: AuthenticationService) {
      
     }

  /** GET Messages from the server */
  getMessages (): Observable<Message[]> {
    return this.http.get<Message[]>(this.MessagesUrl, { headers: this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        catchError(this.loggerService.handleError('getMessage', EnumPriority.Major, []))
      );
  }

  /** GET Message by id. Return `undefined` when id not found */
  getMessageNo404<Data>(id: number): Observable<Message> {
    const url = `${this.MessagesUrl}?id=${id}`;
    return this.http.get<Message[]>(url, { headers: this.authenticationService.getHttpHeaderWithToken().headers })
      .pipe(
        map(Messages => Messages[0]), // returns a {0|1} element array
        tap(h => {
          console.log(h ? `fetched` : `did not find`);
         }),
        catchError(this.loggerService.handleError<Message>(`getMessage id=${id}`, EnumPriority.Major))
      );
  }

  /** GET Message by id. Will 404 if id not found */
  getMessage(id: number): Observable<Message> {
    const url = `${this.MessagesUrl}${id}`;
    return this.http.get<Message>(url, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<Message>(`getMessage id=${id}`, EnumPriority.Major))
    );
  }

  /* GET Messages whose name contains search term */
  searchMessages(term: string): Observable<Message[]> {
    if (!term.trim()) {
      // if not search term, return all Messages.
      return this.http.get<Message[]>(this.MessagesUrl, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
        
        catchError(this.loggerService.handleError<Message[]>('searchMessage', EnumPriority.Major, []))
      );
    }
    return this.http.get<Message[]>(`${this.MessagesUrl}?name=${term}`, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('searchMessage', EnumPriority.Major))
    );
  }

  //////// Save methods //////////

  /** POST: add a new Message to the server */
  addMessage (Message: Message): Observable<Message> {
    return this.http.post<Message>(this.MessagesUrl, Message, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
     catchError(this.loggerService.handleError<any>('addMessage', EnumPriority.Major))
    );
  }

  /** DELETE: delete the Message from the server */
  deleteMessage (Message: Message | number): Observable<Message> {
    const id = typeof Message === 'number' ? Message : Message.id;
    const url = `${this.MessagesUrl}${id}`;

    return this.http.delete<Message>(url, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('deleteMessage', EnumPriority.Major))
    );
  }

  /** PUT: update the Message on the server */
  updateMessage (Message: Message): Observable<any> {
    return this.http.put(this.MessagesUrl, Message, { headers: this.authenticationService.getHttpHeaderWithToken().headers }).pipe(
      catchError(this.loggerService.handleError<any>('updateMessage', EnumPriority.Major))
    );
  }



}
