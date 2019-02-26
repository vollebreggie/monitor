import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../Models/User';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private url = 'http://127.0.0.1:8080';

    // http options used for making API calls
    private httpOptions: any;

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    
    constructor(private http: HttpClient) {
        let user = JSON.parse(localStorage.getItem('currentUser')) as User;
        this.currentUserSubject = new BehaviorSubject<User>(user);
        this.currentUser = this.currentUserSubject.asObservable();

        if (user == null) {
            this.httpOptions = {
                headers: new HttpHeaders({ 'Content-Type': 'application/json' })
            };
        } else if (user != null) {
            this.httpOptions = {
                headers: new HttpHeaders(
                    {
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + user.token
                    })
            };
        }
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {

        return this.http.post<any>(`${this.url}login/`, { username, password })
            .pipe(map(data => {
                let user = data;
                //login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return user;
            }));
    }

    public register(nickname: string, email: string, username: string, password: string) {
        return this.http.post(`${this.url}/register/`, JSON.stringify({ nickname, email, username, password }), this.httpOptions)
            .pipe(map((user: any) => {
                return this.validateUser(user);
            },
                err => {
                    console.error('login error', err);
                    //this.errors = err['error'];
                }
            ));
    }

    public loginWithToken(username: string, password: string) {
        return this.http.post(`${this.url}/loginWithToken/`, JSON.stringify({ username, password }), this.httpOptions)
            .pipe(map((user: any) => {
                return this.validateUser(user);
            },
                err => {
                    console.error('Login error: ', err);
                    //this.errors = err['error'];
                }
            ));
    }

    private validateUser(user: any) {
        if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
        }
        this.httpOptions = {
            headers: new HttpHeaders(
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + user.token
                })
        };
        return user;
    }

    public getHttpHeaderWithToken(): any {
        return this.httpOptions;
    }

    public logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.httpOptions = {
            headers: new HttpHeaders(
                {
                    'Content-Type': 'application/json'
                })
        };
    }

}