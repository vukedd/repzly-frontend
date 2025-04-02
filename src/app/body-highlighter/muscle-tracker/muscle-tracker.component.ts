import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { BodyHighlighterComponent } from "../component/body-highlighter.component";
import { BodyPartHighlight } from '../body-highlighter.model';
import { VolumeService } from '../volume.service'; // Adjust path as needed
import { finalize } from 'rxjs/operators';

// PrimeNG Modules
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // For loading indicator
import { MessageModule } from 'primeng/message'; // For error display

@Component({
  selector: 'app-muscle-tracker',
  standalone: true, // Mark as standalone
  imports: [
    CommonModule, // Add CommonModule
    FormsModule,  // Add FormsModule
    BodyHighlighterComponent,
    CalendarModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    TitleCasePipe // For potential display formatting
  ],
  templateUrl: './muscle-tracker.component.html',
  styleUrls: ['./muscle-tracker.component.css'] // Corrected property name
})
export class MuscleTrackerComponent implements OnInit {
  highlightData: BodyPartHighlight[] = []; // Initialize empty
  customColors = ['#FFFACD', '#FFEB3B', '#FFC107', '#FFA000', '#FF6F00']; // 5 intensity levels

  startDate: Date | null = null;
  endDate: Date | null = null;
  maxDate = new Date(); // Prevent selecting future dates

  isLoading = false;
  errorMessage: string | null = null;

  // --- Mapping from backend Muscle Name to Frontend Slug ---
  // This is crucial and needs to exactly match your backend names and frontend slugs
  private muscleNameToSlugMap: Record<string, string> = {
    'Neck': 'neck-front', // Assuming neck-front covers it
    'Front Deltoid': 'front-deltoid',
    'Side Deltoid': 'side-deltoid',
    'Triceps': 'triceps-back', // Or 'triceps-front', decide which slug is primary or handle duplication
    'Tibialis': 'tibialis',
    'Calves': 'calves-back', // Or 'calves-front'
    'Chest': 'chest',
    'Biceps': 'biceps',
    'Trapezius': 'trapezius-front', // Or map to upper-back/traps slug from back view
    'Forearms': 'forearm-back', // Or 'forearms-front'
    'Abs': 'abs',
    'Obliques': 'obliques',
    'Quads': 'quads',
    'Adductors': 'adductors-front', // Or 'adductors-back'
    'Abductors': 'abductors-front',
    // 'Knees': 'knees', // Usually not tracked as a muscle target
    'Lats': 'lats',
    'Upper Back': 'upper-back',
    'Rear Deltoids': 'deltoids-back', // Explicitly map the rear version if needed
    'Lower Back': 'lower-back',
    'Glutes': 'glutes',
    'Hamstrings': 'hamstrings'
    // Add any other specific mappings if your backend uses slightly different names
  };
  // ---------------------------------------------------------

  constructor(private volumeService: VolumeService) {}

  ngOnInit(): void {
    // Optionally fetch data for a default range on load
    // this.fetchMuscleUsage();
  }

  fetchMuscleUsage(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.highlightData = []; // Clear previous highlights

    this.volumeService.getMuscleUsage(this.startDate, this.endDate)
      .pipe(
        finalize(() => this.isLoading = false) // Ensure loading stops on complete/error
      )
      .subscribe({
        next: (data) => {
          console.log("Raw data received:", data);
          this.highlightData = this.processMuscleData(data);
          console.log("Processed highlight data:", this.highlightData);
          if (this.highlightData.length === 0 && Object.keys(data).length > 0) {
              this.errorMessage = "Received data, but could not map muscle names to visualizer slugs. Check console and mapping.";
          } else if (this.highlightData.length === 0) {
              this.errorMessage = "No muscle usage data found for the selected period.";
          }
        },
        error: (err) => {
          console.error("Error fetching muscle usage:", err);
          this.errorMessage = "Failed to fetch muscle usage data. Please try again later.";
          // More specific error handling based on err.status or err.error possible
        }
      });
  }

  private processMuscleData(rawData: Record<string, number>): BodyPartHighlight[] {
    const processed: BodyPartHighlight[] = [];
    const values = Object.values(rawData);

    if (values.length === 0) {
      return []; // No data to process
    }

    // --- Normalization/Scaling Logic ---
    // Find the maximum usage value to scale intensity (0 to 4 for 5 colors)
    const maxValue = Math.max(...values);

    if (maxValue <= 0) {
        console.warn("Max usage value is zero or negative, cannot scale intensity.");
        // Optionally return raw values or a default intensity if desired
        // For now, we return empty as scaling doesn't make sense.
        return [];
    }
    // ----------------------------------

    for (const [muscleName, value] of Object.entries(rawData)) {
      const slug = this.muscleNameToSlugMap[muscleName];
      if (slug) {
        // Scale the value to an intensity level (0-4 for 5 colors)
        // Using Math.ceil to ensure even small values get intensity 1 (index 0 is color 1)
        // Adjust scale factor if you have more/less colors
        const intensity = Math.min(this.customColors.length -1, Math.ceil((value / maxValue) * (this.customColors.length -1)));

        processed.push({ slug: slug, intensity: intensity + 1 }); // Intensity 1-5
      } else {
        console.warn(`No slug mapping found for muscle name: "${muscleName}"`);
      }
    }
    return processed;
  }
}