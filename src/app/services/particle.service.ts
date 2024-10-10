import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ParticleService {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  init(canvas: HTMLCanvasElement) {
    if (isPlatformBrowser(this.platformId)) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.resizeCanvas();
      this.createParticles();
      this.lastTime = performance.now();
      this.animate(this.lastTime);

      window.addEventListener('resize', () => this.resizeCanvas());
    }
  }

  private resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  private createParticles() {
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle(this.canvas!));
    }
  }

  private animate(currentTime: number) {
    this.ngZone.runOutsideAngular(() => {
      this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;
      this.updateParticles(deltaTime);
    });
  }

  private updateParticles(deltaTime: number) {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(particle => particle.update(this.ctx!, deltaTime));
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

class Particle {
  private x: number;
  private y: number;
  private size: number;
  private speedX: number;
  private speedY: number;
  private baseColor: string;
  private opacity: number;
  private fadeIn: boolean;

  constructor(private canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5; // Reduced speed
    this.speedY = (Math.random() - 0.5) * 0.5; // Reduced speed
    this.baseColor = `${Math.random() * 255}, ${Math.random() * 255}, 255`;
    this.opacity = 0;
    this.fadeIn = true;
  }

  update(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }

    // Update opacity
    if (this.fadeIn) {
      this.opacity += deltaTime / 6000; // Fade in over 6 seconds
      if (this.opacity >= 1) {
        this.opacity = 1;
        this.fadeIn = false;
      }
    } else {
      this.opacity -= deltaTime / 6000; // Fade out over 6 seconds
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.fadeIn = true;
      }
    }

    ctx.fillStyle = `rgba(${this.baseColor}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}