import { Component } from '@angular/core';
import { AnimatedBannerComponent } from "../../animated-banner/animated-banner.component";
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-landing-page',
  imports: [AnimatedBannerComponent, AnimateOnScrollModule, CardModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
