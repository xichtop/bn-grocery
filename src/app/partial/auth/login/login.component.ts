import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authState : any;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.authService.login({
      username: form.value.username,
      password: form.value.password
    });
  }

}
