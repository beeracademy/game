import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public users: User[];

  constructor(private http: HttpClient) {
    this.users = [];
  }

  public login(username: string, password: string): Observable<User> {
    return this.http.post(`${environment.url}/login`, {
      username,
      password
    });
  }
}
