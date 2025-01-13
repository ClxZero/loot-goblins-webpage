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
  backgrounds: string[] = [
    'assets/imgs/dedloc_bg.webp',
    'assets/imgs/turkoid_bg.webp',
    'assets/imgs/riot_bg.webp',
    'assets/imgs/vity_bg.webp',
  ];

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
    // const mainContainerElement =
    //   this.el.nativeElement.querySelector('.main-container');
    // if (!mainContainerElement) return;

    // Set appropriate background
    if (url === '/' || url === '/home') {
      this.isHomePage = true;
      // this.renderer.setStyle(
      //   mainContainerElement,
      //   'background',
      //   'url("../assets/imgs/fondo-completo.webp") no-repeat center top'
      // );
    } else if (url === '/specs') {
      this.isHomePage = false;
      // const randomBg =
      //   this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
      // this.renderer.setStyle(
      //   mainContainerElement,
      //   'background-image',
      //   `url(${randomBg})`
      // );
      // this.renderer.setStyle(
      //   mainContainerElement,
      //   'background-position',
      //   'center'
      // );
      // this.renderer.setStyle(mainContainerElement, 'background-size', 'cover');
      // this.renderer.setStyle(mainContainerElement, 'position', 'relative');
      // this.renderer.setStyle(mainContainerElement, 'z-index', '1');
    }

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
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.particleService.destroy();
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }
    }
  }
}
