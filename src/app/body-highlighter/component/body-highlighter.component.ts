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
  /**
   * Defines the size of each intensity range for color mapping.
   * Example: If rangeSize is 5 and colors has 5 entries:
   * - Intensity 1-5  -> colors[0]
   * - Intensity 6-10 -> colors[1]
   * - Intensity 11-15 -> colors[2]
   * - Intensity 16-20 -> colors[3]
   * - Intensity 21+  -> colors[4] (clamped to the last color)
   */
  @Input() intensityRangeSize: number = 5; // Default range size
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
      return '20 50 300 450';
    } else {
      return '20 50 300 450';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recalculate styles if data, colors, default color, OR range size changes
    if (changes['data'] || changes['colors'] || changes['defaultFillColor'] || changes['intensityRangeSize']) {
      // Basic validation for range size
      if (this.intensityRangeSize <= 0) {
        console.warn('BodyHighlighterComponent: intensityRangeSize must be greater than 0. Using default of 1.');
        this.intensityRangeSize = 1; // Prevent division by zero or infinite loops
      }
      this.calculateHighlightStyles();
    }
  }

  private calculateHighlightStyles(): void {
    const styles: { [key: string]: { fill: string } } = {};
    if (!this.data || this.data.length === 0 || this.colors.length === 0) {
      this.highlightStyles = {}; // Reset styles if no data or colors
      return;
    }

    this.data.forEach(part => {
      // Ensure intensity is at least 1 for calculation purposes
      const intensityValue = Math.max(1, part.intensity);

      // Calculate the index based on the range size.
      // (intensityValue - 1) makes it 0-based for the first range (e.g., 1-5 -> 0-4).
      // Dividing by rangeSize gives the range group (e.g., 0-4 / 5 = 0.x, 5-9 / 5 = 1.x).
      // Math.floor gets the integer index (0, 1, 2...).
      const calculatedIndex = Math.floor((intensityValue - 1) / this.intensityRangeSize);

      // Clamp the index to ensure it's within the bounds of the colors array.
      // It cannot be less than 0, and not more than the last index of the colors array.
      const colorIndex = Math.max(0, Math.min(calculatedIndex, this.colors.length - 1));

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