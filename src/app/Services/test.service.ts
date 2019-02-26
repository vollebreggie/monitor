import { CustomRequestOptionsService } from './customRequestOptionService';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TestService {

  // http options used for making API calls
  private httpOptions: any;

  // the actual JWT token
  public token: string;

  // the token expiration date
  public token_expires: Date;

  // the username of the logged in user
  public username: string;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient,
    private customRequestOptionService: CustomRequestOptionsService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }
  
  private userUrl = 'http://127.0.0.1:8080';
  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(username: string, password: string) {
    let options = {
      headers: this.customRequestOptionService.authorizationRequestOptions(),
      withCredentials: true
   }

    this.http.post(`${this.userUrl}/loginWithToken/`, JSON.stringify({ username, password }), this.httpOptions).subscribe(
      data => {
        console.log('login success', data);
        let option  = {
          headers: new HttpHeaders(
            {'Content-Type': 'application/json',
              'Authorization': 'Token ' + data['token'] })
        };
        this.http.get(`${this.userUrl}/api/sampleapi/`, option).subscribe(
          data=>{
            console.log(data);
          }
        )
        //this.updateData(data['token']);
      },
      err => {
        console.error('login error', err);
        //this.errors = err['error'];
      }
    );
  }

  /**
   * Refreshes the JWT token, to extend the time the user is logged in
   */
  public refreshToken() {
    this.http.post('/api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        console.log('refresh success', data);
        this.updateData(data['token']);
      },
      err => {
        console.error('refresh error', err);
        this.errors = err['error'];
      }
    );
  }

  public logout() {
    this.token = null;
    this.token_expires = null;
    this.username = null;
  }

  private updateData(token) {
    this.token = token;
    this.errors = [];

    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }

}
