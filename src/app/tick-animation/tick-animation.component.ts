import { Component, ElementRef, ViewChild } from '@angular/core';
import Lottie from 'lottie-web';

@Component({
  selector: 'app-tick-animation',
  templateUrl: './tick-animation.component.html',
  styleUrls: ['./tick-animation.component.css']
})
export class TickAnimationComponent {
  @ViewChild('lottieAnimation') lottieAnimationContainer!: ElementRef;
  ngAfterViewInit() {
    this.playLottieAnimation();
  }
  playLottieAnimation() {
    Lottie.loadAnimation({
      container: this.lottieAnimationContainer.nativeElement,
      renderer: 'svg', // or 'canvas', choose based on your preference
      loop: true, // Set loop to true if needed
      autoplay: true, // Autoplay the animation
      path: 'assets/tick.json' // Path to your animation JSON file
    });
  }
}
