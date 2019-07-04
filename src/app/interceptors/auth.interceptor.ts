import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private usersService: UsersService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.usersService.users.length > 0) {
      request = request.clone({
        setHeaders: {
          'Authorization':  'Token ' + this.usersService.users[0].token
        }
      });
    }

    return next.handle(request);
  }
}
