import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, empty } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const system = {
    name: "pspl",
    version: "alfa",
    release_date: new Date()
}

class Message {
    system: System;
    log: Log;
    created: Date;
}

class System {
    name: string;
    version: string;
    release_date: Date;
}

class Log {
    shortmessage: string;
    description: string;
    stacktrace: string;
    type: number;
    priority: number;
}

class Type {
    id: number;
}

class Priority {
    id: number;
}

export enum EnumType {
    Log = 1,
    Error = 2,
    Warning = 3,
}

export enum EnumPriority {
    Trivial = 1,
    Major = 2,
    Critical = 3,
    Blocker = 4
}

@Injectable({ providedIn: 'root' })
export class LoggerService {

    private loggerUrl = 'http://127.0.0.1:8080/message/';  // URL to web api
    private connected = false;
    constructor(
        private http: HttpClient,
        ) { }


    //////// Log message //////////

    /**
     * Handle operations that failed.
     * Let the app continue by returning an empty result.
     * @param shortmessage - brief message concerning the log
     * @param type - the type of message 
     * @param priority - impact on the system
     * @param stacktrace - optional, detailed information about the a possible error
     * @param description - optional, a description about the message
     */
    public log(shortmessage: string, enumType: EnumType, enumPriority: EnumPriority, stacktrace?: any, description?: string): Observable<Message> {
        let message = new Message();
        let type = new Type();
        type.id = enumType;
        let priority = new Priority();
        priority.id = enumPriority;
        message.log = new Log();
        message.log.shortmessage = shortmessage;
        message.log.priority = 2;
        message.log.type = 2;
        message.created = new Date();
        message.system = system;

        if (description != null && stacktrace != null) {
            message.log.description = description;
            message.log.stacktrace = stacktrace.message;
        }
        if (description != null && stacktrace == null) {
            message.log.description = description;
            message.log.stacktrace = "empty";
        }
        if (description == null && stacktrace == null) {
            message.log.description = "empty";
            message.log.stacktrace = "empty";
        }
        if (description == null && stacktrace != null) {
            message.log.description = "empty";
            message.log.stacktrace = stacktrace.message;
        }
        if(this.connected)
        {
            return this.http.post<Message>(this.loggerUrl, message, httpOptions);
        }else{
            return empty();
        }
        
    }

    /**
     * Handle operations that failed.
     * Let the app continue by returning an empty result.
     * @param shortmessage - brief message concerning the error
     * @param priority - impact on the system
     */
    public handleError<T>(shortmessage: string, priority: EnumPriority, result?: T) {
        return (error: any): Observable<T> => {
            this.log(shortmessage, EnumType.Error, priority, error).pipe(
                distinctUntilChanged()
            ).subscribe();

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /**
   * Handle operations that almost failed.
   * Let the app continue by returning an empty result.
   * @param shortmessage - brief message concerning the error
   * @param priority - impact on the system
   */
    public handleWarning<T>(shortmessage: string, priority: EnumPriority, result?: T) {
        return (warning: any): Observable<T> => {

            this.log(shortmessage, EnumType.Warning, priority, warning).subscribe();

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /**
 * Handle operations that almost failed.
 * Let the app continue by returning an empty result.
 * @param shortmessage - brief message concerning the error
 * @param priority - impact on the system
 */
    public handleLog(shortmessage: string, priority: EnumPriority, description: string) {
        this.log(shortmessage, EnumType.Warning, priority, null, description).pipe(
            distinctUntilChanged()
        ).subscribe();
    }

}
