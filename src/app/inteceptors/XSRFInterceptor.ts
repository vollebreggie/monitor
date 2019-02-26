import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HttpInterceptor, HttpXsrfTokenExtractor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class HttpXSRFInterceptor implements HttpInterceptor {

  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headerName = 'CSRF-TOKEN';
    const respHeaderName = 'csrf-token';
    let token = this.tokenExtractor.getToken() as string;
    if (token !== null && !req.headers.has(headerName)) {
      req = req.clone({ headers: req.headers.set(respHeaderName, token) });
    }
    return next.handle(req);
  }
}