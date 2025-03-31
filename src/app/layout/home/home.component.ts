import { Component } from '@angular/core';
import { BodyHighlighterComponent } from "../../body-highlighter/component/body-highlighter.component";
import { BodyPartHighlight } from '../../body-highlighter/body-highlighter.model';

@Component({
  selector: 'app-home',
  imports: [BodyHighlighterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  highlightData: BodyPartHighlight[] = [
        // Front examples
        { slug: 'chest-left', intensity: 4 },
        { slug: 'abs-upper', intensity: 3 },
        // Back examples (using slugs from the new data)
        { slug: 'gluteal-right', intensity: 2 },
        { slug: 'upper-back-left', intensity: 5 },
        { slug: 'trapezius-right-back', intensity: 1 },
        { slug: 'hamstring-left', intensity: 3 },
      ];
      customColors = ['#FFFACD', '#FFEB3B', '#FFC107', '#FFA000', '#FF6F00'];
}
