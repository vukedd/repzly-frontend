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
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { JwtService } from '../../auth/jwt/jwt.service';
// New interface for muscle sets data
interface MuscleSetItem {
  muscleName: string;
  sets: number;
  colorHex: string;
}

@Component({
  selector: 'app-muscle-tracker',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ChipModule,
    TableModule,
    PanelModule,
    MessageModule,
    DividerModule,
    BadgeModule,
    FormsModule,
    BodyHighlighterComponent,
    DatePickerModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule  ],
  templateUrl: './muscle-tracker.component.html',
  styleUrls: ['./muscle-tracker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[MessageService]
})
export class MuscleTrackerComponent implements OnInit {
  highlightData: BodyPartHighlight[] = [];
  customColors = ['#FFFACD', '#FFEB3B', '#FFC107', '#FFA000', '#FF6F00'];
  totalSets:number = 0;
  
  // New property to store muscle sets data for display
  muscleSetsData: MuscleSetItem[] = [];

  // Initialize with default dates
  startDate: Date | null = this.getDefaultStartDate(); // Call helper function
  endDate: Date | null = new Date(); // Today
  maxDate = new Date();

  isLoading = false;
  errorMessage: string | null = null;

  // The inverse mapping from slug to muscle name
  private slugToMuscleNameMap: Record<string, string> = {};

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
    private cdr: ChangeDetectorRef,
    private jwtService: JwtService
  ) {
    // Initialize the inverse mapping
    this.initSlugToMuscleNameMap();
  }

  // Create the inverse mapping for display purposes
  private initSlugToMuscleNameMap(): void {
    Object.entries(this.muscleNameToSlugMap).forEach(([muscleName, slugOrSlugs]) => {
      if (Array.isArray(slugOrSlugs)) {
        slugOrSlugs.forEach(slug => {
          this.slugToMuscleNameMap[slug] = muscleName;
        });
      } else {
        this.slugToMuscleNameMap[slugOrSlugs] = muscleName;
      }
    });
  }

  ngOnInit(): void {
    // Fetch data for the default range when the component initializes
    if (this.isLoggedIn()) {
    this.fetchMuscleUsage();
    }
  }

  public isLoggedIn(): boolean {
    return this.jwtService.isLoggedIn()
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

  // Helper function to get color for a value based on intensity
  private getColorForValue(value: number, maxValue: number): string {
    if (maxValue <= 0) return this.customColors[0];
    
    // Calculate index into color array
    const normalizedValue = value / maxValue;
    const index = Math.min(
      Math.floor(normalizedValue * this.customColors.length),
      this.customColors.length - 1
    );
    
    return this.customColors[index];
  }

  fetchMuscleUsage(): void {
    // Basic check: Ensure dates are selected before fetching
    if (!this.startDate || !this.endDate) {
      this.errorMessage = "Please select both a start and end date.";
      return; // Stop execution if dates are missing
    }

    this.isLoading = true;
    this.errorMessage = null;
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
          const processedData = this.processMuscleData(data);
          this.highlightData = [...processedData]; // Force new reference
          this.totalSets = this.getTotalSets(data);
          
          // Process data for the muscle sets display
          this.generateMuscleSetsDisplay(data);

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
          // Reset displayed data
          this.highlightData = [];
          this.muscleSetsData = [];
          this.cdr.markForCheck();
        }
      });
  }

  // Generate the data for the muscle sets display panel
  private generateMuscleSetsDisplay(rawData: Record<string, number>): void {
    // Clear previous data
    this.muscleSetsData = [];
    
    // Calculate max value for color intensity
    const values = Object.values(rawData);
    if (values.length === 0) return;
    
    const maxValue = Math.max(...values);
    if (maxValue <= 0) return;
    
    // Create formatted display data and sort by number of sets (descending)
    this.muscleSetsData = Object.entries(rawData)
      .map(([muscleName, sets]) => ({
        muscleName,
        // Round the sets to 2 decimal places for display
        sets: Number(sets.toFixed(2)),
        colorHex: this.getColorForValue(sets, maxValue)
      }))
      .sort((a, b) => b.sets - a.sets);
      
    this.cdr.markForCheck();
  }

  private processMuscleData(rawData: Record<string, number>): BodyPartHighlight[] {
    const processed: BodyPartHighlight[] = [];
    const values = Object.values(rawData);
  
    if (values.length === 0) return [];
  
    const maxValue = Math.max(...values);
    if (maxValue <= 0) return [];
  
    for (const [muscleName, value] of Object.entries(rawData)) {
      const slugOrSlugs = this.muscleNameToSlugMap[muscleName];
      
      // Round the intensity value to 2 decimal places
      const roundedIntensity = Number(value.toFixed(2));
  
      if (slugOrSlugs) {
        // Pass the rounded intensity value, not normalized
        // Let the highlighter handle the range-based color mapping
        
        // Handle array of slugs or single slug
        if (Array.isArray(slugOrSlugs)) {
          slugOrSlugs.forEach(slug => {
            processed.push({ slug: slug, intensity: roundedIntensity });
          });
        } else {
          processed.push({ slug: slugOrSlugs, intensity: roundedIntensity });
        }
      } else {
        console.warn(`No slug mapping found for muscle name: "${muscleName}"`);
      }
    }
  
    return processed;
  }
 
  private getTotalSets(muscleData: Record<string, number>): number {
    // Calculate the total and round to 2 decimal places at the end
    const total = Object.values(muscleData).reduce((total, sets) => total + sets, 0);
    return Number(total.toFixed(2));
  }
}