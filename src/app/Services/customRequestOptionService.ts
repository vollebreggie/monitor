
import { CookieService } from "angular2-cookie/services/cookies.service";
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CustomRequestOptionsService {

    constructor(
        private cookieService: CookieService
    ) { }

    defaultRequestOptions() {
        return new HttpHeaders({
                'Content-Type': 'application/json',
            });
    }

    authorizationRequestOptions() {
        return new HttpHeaders({
                'Content-Type': 'application/json',
                'X-CSRFToken': this.cookieService.get('csrftoken')
            });
    }
}