// src/app/body-highlighter/body-highlighter.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; // Keep CommonModule for ngFor, ngStyle etc.
import { TooltipModule } from 'primeng/tooltip'; // *** ADD TooltipModule ***

import { BodyPartHighlight, BodyPartDefinition, BodyPartSlug } from '../body-highlighter.model';
import { bodyFrontDefinition } from '../body-front-definition.data';
import { bodyBackDefinition } from '../body-back-definition.data';

@Component({
  selector: 'app-body-highlighter',
  templateUrl: './body-highlighter.component.html',
  styleUrls: ['./body-highlighter.component.css'],
  // *** ADD TooltipModule TO IMPORTS ***
  imports: [CommonModule, TooltipModule],
  standalone: true, // Make sure standalone is true
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BodyHighlighterComponent implements OnChanges {

  // --- Inputs ---
  @Input() data: BodyPartHighlight[] = [];
  @Input() side: 'front' | 'back' = 'front';
  @Input() colors: string[] = ['#ADD8E6', '#87CEEB', '#00BFFF', '#1E90FF', '#0000FF'];
  @Input() defaultFillColor: string = '#CCCCCC';
  @Input() strokeColor: string = '#333333';
  @Input() strokeWidth: number = 0.5; // Use transform

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
    // Verified viewBox values based on your previous confirmation
    if (this.side === 'back') {
      return '770 50 650 1350'; // BACK viewBox
    } else {
      return '50 50 650 1350';  // FRONT viewBox
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['colors'] || changes['defaultFillColor']) {
      this.calculateHighlightStyles();
    }
  }

  private calculateHighlightStyles(): void {
    const styles: { [key: string]: { fill: string } } = {};
    this.data?.forEach(part => {
      const colorIndex = Math.max(0, Math.min(part.intensity - 1, this.colors.length - 1));
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

} // End Component