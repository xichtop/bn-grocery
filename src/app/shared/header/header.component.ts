import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../../partial/auth/auth.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'side-bar',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() toggle = new EventEmitter();
  isAuth = false;
  authSubscription = new Subscription();
  
  private destroy$ = new Subject();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.isAuth = status;
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  closeSidebar() {
    this.toggle.emit();
  }

  onLogout() {
    this.toggle.emit();
    this.authService.logout();
  }

}
