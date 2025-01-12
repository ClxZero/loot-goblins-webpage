import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  HostListener,
  OnInit,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NavbarComponent} from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setHomeBackground();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setRandomShineDelays();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      const mainContainerElement = document.querySelector('.main-container');
      if (mainContainerElement) {
        this.renderer.removeClass(mainContainerElement, 'home-bg');
      }
    }
  }

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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Remove the scroll effect for the static overlay
  }

  setRandomShineDelays() {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(element => {
      const delay = Math.random() * 5; // Random delay between 0 and 5 seconds
      (element as HTMLElement).style.setProperty(
        '--shine-delay',
        delay.toString()
      );
    });
  }
}
