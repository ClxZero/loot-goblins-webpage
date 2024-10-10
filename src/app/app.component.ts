import {Component, OnInit, OnDestroy, ElementRef, Inject, PLATFORM_ID} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {ParticleService} from './services/particle.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private particleService: ParticleService, 
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const canvas = this.el.nativeElement.querySelector('#particle-canvas') as HTMLCanvasElement;
      if (canvas) {
        this.particleService.init(canvas);
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.particleService.destroy();
    }
  }
}
