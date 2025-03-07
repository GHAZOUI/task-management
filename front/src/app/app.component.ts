import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
// export class AppComponent {
//   title = 'task-management';
// }

// @Component({
//   selector: 'app-root',
//   template: `
//     <button *ngIf="!auth.token" (click)="auth.login()">Login</button>
//     <button *ngIf="auth.token" (click)="auth.logout()">Logout</button>
//     <p *ngIf="auth.token">Token: {{ auth.token }}</p>
//   `
// })
// export class AppComponent {
//   constructor(public auth: AuthService) {}
// }

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <!-- <div *ngIf="!auth.isAuthenticated()">
      <input type="text" [(ngModel)]="username" placeholder="Username">
      <input type="password" [(ngModel)]="password" placeholder="Password">
      <button (click)="login()">Login</button>
    </div>

    <div *ngIf="auth.isAuthenticated()">
      <p>Token: {{ auth.getAccessToken() }}</p>
      <button (click)="logout()">Logout</button>
    </div> -->
    <!-- <app-home></app-home> -->
    <div class="container">
      <router-outlet></router-outlet>
    </div>

  `,
})
export class AppComponent {
  username = '';
  password = '';

  constructor(public auth: AuthService) {}

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: (response) => {
        // this.auth.saveToken(response.access_token);
        console.log('Login successful');
      },
      error: (err) => console.error('Login failed', err),
    });
  }

  logout() {
    this.auth.logout();
  }
}