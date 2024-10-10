import {Component, OnInit, OnDestroy, ElementRef, Inject, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {RouterOutlet, Router, NavigationEnd, Event} from '@angular/router';
import {ParticleService} from './services/particle.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showParticles = false;

  constructor(
    private particleService: ParticleService, 
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.showParticles = event.urlAfterRedirects === '/specs';
        if (this.showParticles) {
          const canvas = this.el.nativeElement.querySelector('#particle-canvas') as HTMLCanvasElement;
          if (canvas) {
            this.particleService.init(canvas);
          }
        } else {
          this.particleService.destroy();
        }
      });
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.particleService.destroy();
    }
  }
}
