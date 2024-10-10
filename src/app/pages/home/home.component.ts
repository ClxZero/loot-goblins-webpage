import { Component, AfterViewInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setRandomShineDelays();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // Remove the scroll effect for the static overlay
  }

  setRandomShineDelays() {
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach((element) => {
      const delay = Math.random() * 5; // Random delay between 0 and 5 seconds
      (element as HTMLElement).style.setProperty('--shine-delay', delay.toString());
    });
  }
}
