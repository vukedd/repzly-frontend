import { Component } from '@angular/core';
import { RouterOutlet,RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from "./layout/header/header.component";
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, RouterModule, HeaderComponent, AvatarModule, InputGroupModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  title = 'fitness-program-app';
  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {}
  }
}

// // src/app/app.component.ts
// import { Component } from '@angular/core';
// import { BodyPartHighlight, BodyPartSlug } from './body-highlighter/body-highlighter.model';
// import { BodyHighlighterComponent } from "./body-highlighter/component/body-highlighter.component";
// // NO LONGER import definitions here, component handles it internally
// // import { bodyFrontDefinition } from './body-highlighter/body-front-definition.data';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
//   imports: [BodyHighlighterComponent]
// })
// export class AppComponent {
//   title = 'Angular Body Highlighter (Front/Back)';

//   // *** REMOVED bodyShapeData property ***

//   // *** ADD property to control the side ***
//   currentSide: 'front' | 'back' = 'front';

//   // Highlight data - Use slugs from EITHER front or back definitions
//   highlightData: BodyPartHighlight[] = [
//     // Front examples
//     { slug: 'chest-left', intensity: 4 },
//     { slug: 'abs-upper', intensity: 3 },
//     // Back examples (using slugs from the new data)
//     { slug: 'gluteal-right', intensity: 2 },
//     { slug: 'upper-back-left', intensity: 5 },
//     { slug: 'trapezius-right-back', intensity: 1 },
//     { slug: 'hamstring-left', intensity: 3 },
//   ];

//   customColors = ['#FFFACD', '#FFEB3B', '#FFC107', '#FFA000', '#FF6F00']; // Yellow/Orange gradient

//   lastClickedPart: BodyPartSlug | null = null;
//   lastHoveredPart: BodyPartSlug | null = null;

//   onPartClicked(slug: BodyPartSlug): void {
//     console.log(`App Component Received Click: ${slug}`);
//     this.lastClickedPart = slug;

//     // Toggle highlight example (works across sides)
//     const existingIndex = this.highlightData.findIndex(p => p.slug === slug);
//     let newData = [...this.highlightData];
//     if (existingIndex > -1) {
//       newData.splice(existingIndex, 1);
//     } else {
//       // We don't need to check against definition here anymore,
//       // as the component handles invalid clicks gracefully.
//       // Just add the highlight if the slug is valid in our model.
//       newData.push({ slug: slug, intensity: 1 });
//     }
//     this.highlightData = newData;
//   }

//   onPartHovered(slug: BodyPartSlug | null): void {
//     this.lastHoveredPart = slug;
//   }

//   // *** Method to switch the side ***
//   setSide(side: 'front' | 'back'): void {
//     this.currentSide = side;
//     // Optional: Clear highlights when switching sides?
//     // this.highlightData = [];
//   }
// }