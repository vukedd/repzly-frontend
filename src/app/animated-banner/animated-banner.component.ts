import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ThemeService } from '../theme.service';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

@Component({
  selector: 'app-animated-banner',
  templateUrl: './animated-banner.component.html',
  imports: [AnimateOnScrollModule],
  styleUrls: ['./animated-banner.component.css']
})
export class AnimatedBannerComponent implements OnInit {

  colorAccent1: string = '#2563EB';
  colorAccent2: string = '#f0f0f0';
  textColor: string = '#F3F4F6';
  shadowColor: string = 'rgba(0, 0, 0, 0.4)';

  constructor(private el: ElementRef, private renderer: Renderer2, private themeService: ThemeService) {}
  ngOnInit(): void {}

  ngAfterViewInit() {
      setTimeout(() => {
          this.themeService.darkMode$.subscribe(
          {
            next: (isDark: boolean) => {
              if (isDark) {
                this.colorAccent1 = '#27272A';
                this.colorAccent2 = '#27272A';  
                this.textColor = '#F3F4F6';
                this.shadowColor =  'rgba(0, 0, 0, 0.4)';
              } else {
                this.colorAccent1 = '#E0F2FE';
                this.colorAccent2 = '#F3F4F6';
                this.textColor = '#111827';
                this.shadowColor =  'rgba(0, 0, 0, 0.2)';
              }

              this.applyDynamicStyles();
            }
          }
        )
      });
  }

  private applyDynamicStyles(): void {
    const bannerElement = this.el.nativeElement.querySelector('.animated-gradient-banner');
    if (bannerElement) {
      bannerElement.style.setProperty('--gradient-color-accent1', this.colorAccent1);
      bannerElement.style.setProperty('--gradient-color-accent2', this.colorAccent2);
      bannerElement.style.setProperty('--text-color', this.textColor);
      bannerElement.style.setProperty('--text-shadow-color', this.shadowColor);
    }
  }
}