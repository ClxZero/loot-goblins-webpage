import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-screenshots',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './screenshots.component.html',
  styleUrl: './screenshots.component.scss',
})
export class ScreenshotsComponent {}
