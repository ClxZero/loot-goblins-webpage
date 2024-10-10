import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <h1 class="glitch-title" data-text="404 Not Found">404 Not Found</h1>
      <button routerLink="/" class="glitch-btn">Return to Home</button>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #1a1a1a;
      color: #ffffff;
    }
    .glitch-title {
      font-size: 4rem;
      text-transform: uppercase;
      position: relative;
      animation: glitch 1s linear infinite;
    }
    @keyframes glitch {
      2%, 64% {
        transform: translate(2px,0) skew(0deg);
      }
      4%, 60% {
        transform: translate(-2px,0) skew(0deg);
      }
      62% {
        transform: translate(0,0) skew(5deg); 
      }
    }
    .glitch-title:before,
    .glitch-title:after {
      content: attr(data-text);
      position: absolute;
      left: 0;
    }
    .glitch-title:before {
      animation: glitchTop 1s linear infinite;
      clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
      -webkit-clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
    }
    @keyframes glitchTop {
      2%, 64% {
        transform: translate(2px,-2px);
      }
      4%, 60% {
        transform: translate(-2px,2px);
      }
      62% {
        transform: translate(13px,-1px) skew(-13deg); 
      }
    }
    .glitch-title:after {
      animation: glitchBotom 1.5s linear infinite;
      clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
      -webkit-clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
    }
    @keyframes glitchBotom {
      2%, 64% {
        transform: translate(-2px,0);
      }
      4%, 60% {
        transform: translate(-2px,0);
      }
      62% {
        transform: translate(-22px,5px) skew(21deg); 
      }
    }
    .glitch-btn {
      margin-top: 2rem;
      padding: 1rem 2rem;
      background-color: #333;
      color: #fff;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .glitch-btn:hover {
      background-color: #555;
    }
  `]
})
export class NotFoundComponent {}