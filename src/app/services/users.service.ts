import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public users: User[] = [];

  public userColors = [
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f39c12',
    '#d35400',
    '#c0392b'
  ];

  constructor(private http: HttpClient) {
    this.resume();
  }

  public login(username: string, password: string): Observable<User> {
    if (this.isAlreadyLoggedIn(username)) {
      return throwError('Already logged in');
    }

    return this.http.post(`${environment.url}/api-token-auth/`, {
      username,
      password
    }).pipe(map((user: User) => {
      user.username = username;
      user.color = this.userColors.splice(Math.floor(Math.random() * this.userColors.length), 1)[0];
      user.index = this.users.length;

      return user;
    }));
  }

  public create(username, password) {
    return this.http.post(`${environment.url}/api/users/`, {
      username,
      password
    });
  }

  public reset() {
    this.users = [];
  }

  public isAlreadyLoggedIn(username: string): boolean {
    return this.users.filter(u => u.username === username).length > 0;
  }

    /*
    Persistence
  */

  public save() {
    localStorage.setItem('academy:users', JSON.stringify(this.users));
  }

  public resume() {
    this.users = JSON.parse(localStorage.getItem('academy:users')) || this.users;
  }
}
