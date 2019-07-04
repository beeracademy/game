import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public users: User[];

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
    this.users = [
      new User('test', 'form1', '#d35400', 0),
      new User('test', 'form2', '#27ae60', 1),
      new User('test', 'form3', '#c0392b', 2),
      new User('test', 'form4', '#8e44ad', 3),
    ];
  }

  public login(username: string, password: string): Observable<User> {
    return this.http.post(`${environment.url}/api-token-auth/`, {
      username,
      password
    }).pipe(map((user: User, index: number) => {
      user.username = username;
      user.color = this.userColors.splice(Math.floor(Math.random() * this.userColors.length), 1)[0];
      user.index = this.users.length;

      this.users.push(user);
      return user;
    }));
  }

  public create(username, password) {
    return this.http.post(`${environment.url}/api/users/`, {
      username,
      password
    });
  }

  public clearAll() {
    this.users = [];
  }
}
