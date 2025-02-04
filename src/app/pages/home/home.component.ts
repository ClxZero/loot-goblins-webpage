import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  HostListener,
  Renderer2,
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
export class HomeComponent implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setRandomShineDelays();
      this.setDefaultBG();
    }
  }

  setDefaultBG() {
    const mainContainerElement = document.querySelector('.main-container');
    this.renderer.setStyle(
      mainContainerElement,
      'background',
      'url("../assets/imgs/fondo-completo.webp") no-repeat center top'
    );
    this.renderer.setStyle(mainContainerElement, 'background-size', 'cover');
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
