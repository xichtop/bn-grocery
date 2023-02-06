import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../../partial/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit, OnDestroy {

  @Output() toggle = new EventEmitter();
  
  isAuth = false;
  authSubcription = new Subscription();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authSubcription = this.authService.authChange.subscribe(status => {
      this.isAuth = status;
    })
  }

  ngOnDestroy(): void {
    if (this.authSubcription) {
      this.authSubcription.unsubscribe();
    }
  }

  onToggle() {
    this.toggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

}
