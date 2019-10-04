import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() {
    document.querySelector('meta[name=theme-color]').setAttribute('content', '#fff');
    localStorage.clear();
  }

  ngOnInit() {}
}
