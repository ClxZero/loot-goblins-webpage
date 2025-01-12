import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav class="cyber-nav">
      <div class="nav-links">
        <a
          routerLink="/"
          [routerLinkActiveOptions]="{exact: true}"
          routerLinkActive="active"
          class="nav-link"
          data-text="Home"
          >Home</a
        >
        <a
          routerLink="/specs"
          routerLinkActive="active"
          class="nav-link"
          data-text="Specializations"
          >Specializations</a
        >
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {}
