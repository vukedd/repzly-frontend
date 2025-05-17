import { Component, ElementRef, OnInit, Renderer2, Input, model } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-animated-banner',
  templateUrl: './animated-banner.component.html',
  styleUrls: ['./animated-banner.component.css']
})
export class AnimatedBannerComponent implements OnInit {

  @Input() color1: string = '#2563EB';
  @Input() color2: string = '#ffffff';
  @Input() color3: string = '#000000';
  @Input() color4: string = '#f0f0f0';
  @Input() speed: string = '60s'; // e.g., '10s', '20s'

  constructor(private el: ElementRef, private renderer: Renderer2, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.applyDynamicStyles();
    this.themeService.darkMode$.subscribe(
      {
        next: (isDark: boolean) => {
          if (isDark) {
            
          }
        }
      }
    )
  }

  ngOnChanges(): void { // If you want to react to @Input changes
    this.applyDynamicStyles();
  }

  private applyDynamicStyles(): void {
    const bannerElement = this.el.nativeElement.querySelector('.animated-gradient-banner');
    if (bannerElement) {
      this.renderer.setStyle(bannerElement, '--gradient-color-1', this.color1);
      this.renderer.setStyle(bannerElement, '--gradient-color-2', this.color2);
      this.renderer.setStyle(bannerElement, '--gradient-color-3', this.color3);
      this.renderer.setStyle(bannerElement, '--gradient-color-4', this.color4);
      this.renderer.setStyle(bannerElement, '--animation-speed', this.speed);
    }
  }

  // Example method to change colors programmatically
  public changeGradient(): void {
    this.color1 = '#FFC3A0'; // A new set of colors
    this.color2 = '#FF677D';
    this.color3 = '#D4A5A5';
    this.color4 = '#392A48';
    this.speed = '10s';
    this.applyDynamicStyles();
  }
}