// src/app/body-highlighter/body-highlighter.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

import { BodyPartHighlight, BodyPartDefinition, BodyPartSlug } from '../body-highlighter.model';
import { bodyFrontDefinition } from '../body-front-definition.data';
import { bodyBackDefinition } from '../body-back-definition.data';

@Component({
  selector: 'app-body-highlighter',
  templateUrl: './body-highlighter.component.html',
  styleUrls: ['./body-highlighter.component.css'],
  imports: [CommonModule, TooltipModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyHighlighterComponent implements OnChanges {

  // --- Inputs ---
  @Input() data: BodyPartHighlight[] = [];
  @Input() side: 'front' | 'back' = 'front';
  @Input() colors: string[] = ['#ADD8E6', '#87CEEB', '#00BFFF', '#1E90FF', '#0000FF']; // Example: 5 colors
  @Input() rangeBoundaries: number[] = [5, 10, 15, 20];
  /**
   * Defines the size of each intensity range for color mapping.
   * Example: If rangeSize is 5 and colors has 5 entries:
   * - Intensity 1-5  -> colors[0]
   * - Intensity 6-10 -> colors[1]
   * - Intensity 11-15 -> colors[2]
   * - Intensity 16-20 -> colors[3]
   * - Intensity 21+  -> colors[4] (clamped to the last color)
   */
  @Input() defaultFillColor: string = '#CCCCCC';
  @Input() strokeColor: string = '#333333';
  @Input() strokeWidth: number = 0.5;

  // --- Outputs ---
  @Output() bodyPartClick = new EventEmitter<BodyPartSlug>();
  @Output() bodyPartHover = new EventEmitter<BodyPartSlug | null>();

  // --- Internal Properties ---
  highlightStyles: { [key: string]: { fill: string } } = {};
  private readonly bodyFrontDefinition: BodyPartDefinition[] = bodyFrontDefinition;
  private readonly bodyBackDefinition: BodyPartDefinition[] = bodyBackDefinition;

  get currentBodyDefinition(): BodyPartDefinition[] {
    return this.side === 'back' ? this.bodyBackDefinition : this.bodyFrontDefinition;
  }

  get currentViewBox(): string {
    if (this.side === 'back') {
      return '33 70 270 400';
    } else {
      return '33 70 270 400';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recalculate styles if data, colors, default color, OR range size changes
    if (changes['data'] || changes['colors'] || changes['defaultFillColor']) {
      this.calculateHighlightStyles();
    }
  }

  private calculateHighlightStyles(): void {
    const styles: { [key: string]: { fill: string } } = {};
    if (!this.data || this.data.length === 0 || this.colors.length === 0) {
      this.highlightStyles = {};
      return;
    }
  
    // Ensure rangeBoundaries is properly set
    if (!this.rangeBoundaries || this.rangeBoundaries.length === 0) {
      this.rangeBoundaries = [5]; // Default if not set
    }
  
    // Ensure boundaries are properly sorted
    const sortedBoundaries = [...this.rangeBoundaries].sort((a, b) => a - b);
  
    this.data.forEach(part => {
      // Get the actual intensity value
      const intensityValue = part.intensity;
      
      // Find which range the intensity falls into
      let colorIndex = 0;
      for (let i = 0; i < sortedBoundaries.length; i++) {
        if (intensityValue > sortedBoundaries[i]) {
          colorIndex = i + 1;
        } else {
          break;
        }
      }
      
      // Clamp to the available colors
      colorIndex = Math.min(colorIndex, this.colors.length - 1);
      
      // Assign the calculated color to the body part slug
      styles[part.slug as string] = { fill: this.colors[colorIndex] };
    });
  
    this.highlightStyles = styles;
  }

  getPartStyle(slug: BodyPartSlug): { fill: string } {
    return this.highlightStyles[slug as string] || { fill: this.defaultFillColor };
  }

  // --- Event Handlers ---
  onPartClick(slug: BodyPartSlug): void { this.bodyPartClick.emit(slug); }
  onPartMouseOver(slug: BodyPartSlug): void { this.bodyPartHover.emit(slug); }
  onPartMouseOut(): void { this.bodyPartHover.emit(null); }
  trackBySlug(index: number, item: BodyPartDefinition): BodyPartSlug { return item.slug; }

}