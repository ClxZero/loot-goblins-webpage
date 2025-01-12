import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './record.component.html',
  styleUrl: './record.component.scss',
})
export class RecordComponent {}
