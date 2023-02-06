import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from './user.model';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authChange = new Subject<boolean>();
  isAuthenticated = false;

  constructor(
    private router: Router,
    private authAFS: AngularFireAuth,
    private notifierService: NotifierService,
  ) { }

  authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/']);  
  }

  registerUser(authData: AuthData) {
    // this.user = {
    //   userId: Math.round(Math.random() * 10000).toString(),
    //   username: authData.username,
    //   password: authData.password,
    //   accessToken: '',
    // }
    this.authSuccessfully();
  }

  login(authData: AuthData) {
    this.authAFS.signInWithEmailAndPassword(authData.username, authData.password)
      .then(result => {
        this.authSuccessfully();
        this.notifierService.notify('success', 'Đăng nhập thành công!');
      })
      .catch(error => {
        this.notifierService.notify('error', 'Tài khoản hoặc mật khẩu không đúng!');
        console.log(error);
      })
  }

  logout() {
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(['/auth']);
    this.authAFS.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
