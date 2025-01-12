import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {RouterOutlet, Router, NavigationEnd} from '@angular/router';
import {ParticleService} from './services/particle.service';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  showParticles = false;
  isHomePage = false;
  private routerSubscription: Subscription | undefined;
  backgrounds: string[] = ['dedloc', 'turkoid', 'riot', 'vity'];

  constructor(
    private particleService: ParticleService,
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initial background setup based on current route
      this.handleRouteChange(this.router.url);

      // Subscribe to route changes
      this.routerSubscription = this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd => event instanceof NavigationEnd
          )
        )
        .subscribe((event: NavigationEnd) => {
          this.handleRouteChange(event.urlAfterRedirects);
        });
    }
  }

  private handleRouteChange(url: string) {
    const mainContainer =
      this.el.nativeElement.querySelector('.main-container');
    if (!mainContainer) return;

    // Remove all possible background classes
    this.renderer.removeClass(mainContainer, 'home-bg');
    this.renderer.removeClass(mainContainer, 'specs-bg');
    this.backgrounds.forEach(bg => {
      this.renderer.removeClass(mainContainer, bg);
    });

    // Handle particles
    this.showParticles = url === '/specs';
    if (this.showParticles) {
      const canvas = this.el.nativeElement.querySelector('#particle-canvas');
      if (canvas) {
        this.particleService.init(canvas);
      }
    } else {
      this.particleService.destroy();
    }

    // Set appropriate background
    if (url === '/' || url === '/home') {
      this.isHomePage = true;
      this.renderer.addClass(mainContainer, 'home-bg');
    } else if (url === '/specs') {
      this.isHomePage = false;
      const randomBg =
        this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
      this.renderer.addClass(mainContainer, 'specs-bg');
      this.renderer.addClass(mainContainer, randomBg);
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (isPlatformBrowser(this.platformId)) {
      this.particleService.destroy();
    }
  }
}
