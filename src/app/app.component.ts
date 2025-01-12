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
import {RouterOutlet, Router, NavigationEnd, Event} from '@angular/router';
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
  isSpecsPage = false;
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
      this.routerSubscription = this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd => event instanceof NavigationEnd
          )
        )
        .subscribe((event: NavigationEnd) => {
          this.showParticles = event.urlAfterRedirects === '/specs';
          this.isSpecsPage = event.urlAfterRedirects === '/specs';
          this.isHomePage =
            event.urlAfterRedirects === '/' ||
            event.urlAfterRedirects === '/home';
          if (this.showParticles) {
            const canvas = this.el.nativeElement.querySelector(
              '#particle-canvas'
            ) as HTMLCanvasElement;
            if (canvas) {
              this.particleService.init(canvas);
            }
          } else {
            this.particleService.destroy();
          }

          if (this.isHomePage) {
            this.setHomeBackground();
          }

          if (this.isSpecsPage) {
            this.setRandomBackground();
          }
        });
    }
  }
  // TODO: This is not working properly, but I may need it to fix some bg mistakes
  setHomeBackground(): void {
    const mainContainerElement = document.querySelector('.main-container');
    if (mainContainerElement) {
      this.renderer.removeClass(mainContainerElement, 'specs-bg');
      this.renderer.removeClass(mainContainerElement, 'dedloc');
      this.renderer.removeClass(mainContainerElement, 'turkoid');
      this.renderer.removeClass(mainContainerElement, 'riot');
      this.renderer.removeClass(mainContainerElement, 'vity');
      this.renderer.addClass(mainContainerElement, 'home-bg');
    }
  }

  setRandomBackground(): void {
    const randomBackground =
      this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
    const mainContainerElement = document.querySelector('.main-container');

    if (mainContainerElement) {
      // Remove home background and any existing specs backgrounds
      this.renderer.removeClass(mainContainerElement, 'home-bg');
      this.backgrounds.forEach(bg => {
        this.renderer.removeClass(mainContainerElement, bg);
      });

      // Add new background classes
      this.renderer.addClass(mainContainerElement, 'specs-bg');
      this.renderer.addClass(mainContainerElement, randomBackground);
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
