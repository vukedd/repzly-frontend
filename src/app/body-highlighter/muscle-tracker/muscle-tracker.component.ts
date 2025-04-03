import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BodyHighlighterComponent } from "../component/body-highlighter.component";
import { BodyPartHighlight } from '../body-highlighter.model';
import { VolumeService } from '../volume.service';
import { finalize } from 'rxjs/operators';

// PrimeNG Modules
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-muscle-tracker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BodyHighlighterComponent,
    DatePickerModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    TitleCasePipe
  ],
  templateUrl: './muscle-tracker.component.html',
  styleUrls: ['./muscle-tracker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MuscleTrackerComponent implements OnInit {
  highlightData: BodyPartHighlight[] = [];
  customColors = ['#FFFACD', '#FFEB3B', '#FFC107', '#FFA000', '#FF6F00'];

  // Initialize with default dates
  startDate: Date | null = this.getDefaultStartDate(); // Call helper function
  endDate: Date | null = new Date(); // Today
  maxDate = new Date();

  isLoading = false;
  errorMessage: string | null = null;

  // In muscle-tracker.component.ts

  // Change the type signature to allow string or array of strings
  private muscleNameToSlugMap: Record<string, string | string[]> = {
    // Muscles typically only on FRONT view
    'Chest': 'chest',
    'Biceps': 'biceps',
    'Abs': 'abs',
    'Quads': 'quads',
    'Tibialis': 'tibialis', // Primarily front view

    // Muscles typically only on BACK view
    'Lats': 'lats',
    'Upper Back': 'upper-back', // Could overlap with Traps depending on definitions
    'Lower Back': 'lower-back',
    'Glutes': 'glutes',
    'Hamstrings': 'hamstrings',
    'Rear Deltoids': 'deltoids-back', // Assuming this maps to the posterior deltoid slug

    // Muscles visible on BOTH sides (map to an ARRAY of slugs)
    'Neck': ['neck-front'], // Often simplified to front, add 'neck-back' if you have it
    'Front Deltoid': 'front-deltoid', // Explicitly front
    'Side Deltoid': 'side-deltoid', // Often visible from both, but usually highlighted on front view
    'Triceps': ['triceps-front', 'triceps-back'], // Visible front and back
    'Calves': ['calves-front', 'calves-back'], // Visible front and back
    'Trapezius': ['trapezius-front', 'upper-back'], // Traps are complex, map to relevant front/back slugs
    'Forearms': ['forearms-front', 'forearm-back'], // Visible front and back
    'Obliques': 'obliques', // Primarily side/front view
    'Adductors': ['adductors-front', 'adductors-back'], // Visible front and back
    'Abductors': ['abductors-front'], // Primarily front/side view

    // Add any other specific mappings based on your BodyPartDefinition data
  };
  // ---------------------------------------------------------

  constructor(
    private volumeService: VolumeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Fetch data for the default range when the component initializes
    this.fetchMuscleUsage();
  }

  // Helper function to get the date 7 days ago
  private getDefaultStartDate(): Date {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    // Optional: Set time to start of the day if your backend query requires it
    // oneWeekAgo.setHours(0, 0, 0, 0);
    return oneWeekAgo;
  }

  fetchMuscleUsage(): void {
    // Basic check: Ensure dates are selected before fetching
    if (!this.startDate || !this.endDate) {
      this.errorMessage = "Please select both a start and end date.";
      // Clear previous data if desired
      // this.highlightData = [];
      // this.cdr.markForCheck(); // Update UI if clearing data/showing error
      return; // Stop execution if dates are missing
    }

    this.isLoading = true;
    this.errorMessage = null;
    // Don't reset highlightData here if you want to show previous data during loading
    // this.highlightData = [];
    this.cdr.markForCheck();

    this.volumeService.getMuscleUsage(this.startDate, this.endDate)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (data) => {
          console.log("Raw data received:", data);
          const processedData = this.processMuscleData(data);
          this.highlightData = [...processedData]; // Force new reference
          console.log("Processed highlight data (new ref):", this.highlightData);

          if (this.highlightData.length === 0 && Object.keys(data).length > 0) {
            this.errorMessage = "Received data, but could not map muscle names to visualizer slugs. Check console and mapping.";
          } else if (this.highlightData.length === 0 && (this.startDate || this.endDate)) {
            // Check if dates *were* selected for this message
            this.errorMessage = "No muscle usage data found for the selected period.";
          } else {
            this.errorMessage = null; // Clear error if data found
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error("Error fetching muscle usage:", err);
          this.errorMessage = "Failed to fetch muscle usage data. Please try again later.";
          this.cdr.markForCheck();
        }
      });
  }

  // In muscle-tracker.component.ts

  private processMuscleData(rawData: Record<string, number>): BodyPartHighlight[] {
    const processed: BodyPartHighlight[] = [];
    const values = Object.values(rawData);
  
    if (values.length === 0) return [];
  
    const maxValue = Math.max(...values);
    if (maxValue <= 0) return [];
  
    for (const [muscleName, value] of Object.entries(rawData)) {
      const slugOrSlugs = this.muscleNameToSlugMap[muscleName];
  
      if (slugOrSlugs) {
        // Pass the raw value as the intensity, not normalized
        // Let the highlighter handle the range-based color mapping
        
        // Handle array of slugs or single slug
        if (Array.isArray(slugOrSlugs)) {
          slugOrSlugs.forEach(slug => {
            processed.push({ slug: slug, intensity: value });
          });
        } else {
          processed.push({ slug: slugOrSlugs, intensity: value });
        }
      } else {
        console.warn(`No slug mapping found for muscle name: "${muscleName}"`);
      }
    }
  
    return processed;
  }
}