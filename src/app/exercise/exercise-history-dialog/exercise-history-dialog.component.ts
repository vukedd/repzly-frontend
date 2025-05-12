// exercise-history-dialog.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

// PrimeNG imports
import { DynamicDialogConfig, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { ExerciseService } from '../exercise-service.service';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';

// DTO interfaces
interface VolumeMetricDetailsDTO {
  id: number;
  isRange: boolean;
  title: string;
  metricSymbol: string;
}

interface IntensityMetricDetailsDTO {
  id: number;
  minimumIntensity: number;
  maximumIntensity: number;
  isRange: boolean;
  title: string;
  metricSymbol: string;
}

interface SetVolumeDetailsDTO {
  minimumVolume: number;
  maximumVolume: number;
}

interface SetIntensityDetailsDTO {
  minimumIntensity: number;
  maximumIntensity: number;
}

interface SetDetailsDTO {
  id: number;
  volume: SetVolumeDetailsDTO;
  intensity: SetIntensityDetailsDTO;
  volumeMetric: VolumeMetricDetailsDTO;
  intensityMetric: IntensityMetricDetailsDTO;
}

interface DoneSetsHistoryDTO {
  id: number;
  setDetails: SetDetailsDTO;
  volume: number;
  intensity: number;
  date: string;
  weightLifted: number;
}

interface WorkoutExerciseExerciseHistoryDTO {
  id: number;
  doneSets: DoneSetsHistoryDTO[];
}

export interface ExerciseHistoryDTO {
  exerciseId: number;
  exerciseTitle: string;
  workoutExercises: WorkoutExerciseExerciseHistoryDTO[];
}

// Interface for grouped sets by workout exercise and date
interface GroupedSetsByDate {
  date: string;
  sets: DoneSetsHistoryDTO[];
}

@Component({
  selector: 'app-exercise-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DynamicDialogModule,
    ButtonModule,
    ProgressSpinnerModule,
    DividerModule,
    TableModule,
    ChartModule,
    ToastModule,
    AccordionModule,
    CardModule,
    AvatarModule,
    TagModule
  ],
  templateUrl: './exercise-history-dialog.component.html',
  providers: [MessageService]
})
export class ExerciseHistoryDialogComponent implements OnInit {
  exerciseId: number;
  exerciseHistory: ExerciseHistoryDTO | null = null;
  loading = false;
  chartData: any;
  chartOptions: any;

  constructor(
    private dialogRef: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private messageService: MessageService,
    private exerciseService: ExerciseService
  ) {
    this.exerciseId = this.config.data.exerciseId;
  }

  ngOnInit(): void {
    this.loadExerciseHistory();
  }

  loadExerciseHistory(): void {
    this.loading = true;
    this.exerciseService.getExerciseHistory(this.exerciseId).subscribe({
      next: (data) => {
        this.exerciseHistory = data;
        this.prepareChartData();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load exercise history.'
        });
        console.error('Error loading exercise history:', error);
      }
    });
  }


  prepareChartData(): void {
    if (!this.exerciseHistory || !this.exerciseHistory.workoutExercises.length) {
      return;
    }

    // Flatten all sets and sort by date
    const allSets = this.exerciseHistory.workoutExercises
      .flatMap(we => we.doneSets)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Format dates for display
    const dates = allSets.map(set => new Date(set.date).toLocaleDateString());

    // Get weight for each date
    const weights = allSets.map(set => set.weightLifted || 0);

    this.chartData = {
      labels: dates,
      datasets: [
        {
          label: 'Weight',
          data: weights,
          fill: false,
          borderColor: '#10b981',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          },
          title: {
            display: true,
            text: 'Weight (kg/lbs)'
          }
        }
      }
    };
  }

  close(): void {
    this.dialogRef.close();
  }

  // Helper function to format date strings
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // Helper to get the metric symbol for display
  getMetricSymbol(set: DoneSetsHistoryDTO, type: 'volume' | 'intensity'): string {
    if (!set.setDetails) return '';

    return type === 'volume'
      ? set.setDetails.volumeMetric?.metricSymbol || ''
      : set.setDetails.intensityMetric?.metricSymbol || '';
  }

  // Helper to get metric title for display
  getMetricTitle(set: DoneSetsHistoryDTO, type: 'volume' | 'intensity'): string {
    if (!set.setDetails) return '';

    return type === 'volume'
      ? set.setDetails.volumeMetric?.title || 'Reps'
      : set.setDetails.intensityMetric?.title || 'Weight';
  }

  // Process workout exercises to group their sets by date
  // Process workout exercises to group their sets by date
  processWorkoutExercises(): {
    workoutExerciseId: number,
    dateGroups: GroupedSetsByDate[]
  }[] {
    if (!this.exerciseHistory || !this.exerciseHistory.workoutExercises) return []; // Guard against null/undefined workoutExercises

    // 1. Create a mutable copy of workoutExercises to sort
    const sortedWorkoutExercises = [...this.exerciseHistory.workoutExercises];

    // 2. Sort the workoutExercises array
    sortedWorkoutExercises.sort((weA, weB) => {
      // Helper function to find the newest date in a WorkoutExerciseExerciseHistoryDTO
      const getNewestDate = (workoutExercise: WorkoutExerciseExerciseHistoryDTO): Date | null => {
        if (!workoutExercise.doneSets || workoutExercise.doneSets.length === 0) {
          return null; // No sets, so no date to compare; or handle as oldest
        }
        // Find the maximum date among its doneSets
        let maxDate = new Date(workoutExercise.doneSets[0].date);
        for (let i = 1; i < workoutExercise.doneSets.length; i++) {
          const currentDate = new Date(workoutExercise.doneSets[i].date);
          if (currentDate > maxDate) {
            maxDate = currentDate;
          }
        }
        return maxDate;
      };

      const newestDateA = getNewestDate(weA);
      const newestDateB = getNewestDate(weB);

      // Handle cases where one or both might not have dates
      if (newestDateA === null && newestDateB === null) return 0; // Both no dates, keep order
      if (newestDateA === null) return 1; // A has no date, B comes first (newest)
      if (newestDateB === null) return -1; // B has no date, A comes first (newest)

      // Sort by newest date descending (newest first)
      return newestDateB.getTime() - newestDateA.getTime();
    });

    // 3. Now map over the sortedWorkoutExercises
    return sortedWorkoutExercises.map(workoutExercise => {
      // Group this workout exercise's sets by date
      const groupedByDate: Map<string, DoneSetsHistoryDTO[]> = new Map();

      // Ensure doneSets is not null or undefined before trying to iterate
      if (workoutExercise.doneSets) {
        workoutExercise.doneSets.forEach(set => {
          const dateStr = this.formatDate(set.date); // Assumes formatDate returns a consistent string for grouping
          if (!groupedByDate.has(dateStr)) {
            groupedByDate.set(dateStr, []);
          }
          groupedByDate.get(dateStr)?.push(set);
        });
      }

      // Convert the map to an array and sort by date (newest first within this workoutExercise group)
      const dateGroups = Array.from(groupedByDate.entries())
        .map(([date, sets]) => ({ date, sets }))
        .sort((a, b) => {
          // When `formatDate` returns something like 'MM/DD/YYYY',
          // direct string comparison won't work for date sorting.
          // It's better to parse back to Date objects for sorting dateGroups if `date` is a formatted string.
          // However, your `formatDate` uses `toLocaleDateString()` which might not be sortable directly as string
          // and might vary by locale.
          // It's safer if `dateGroup.date` stored the original ISO date string or a consistent sortable format.
          // For now, assuming your formatDate produces consistently sortable strings OR we re-parse.
          // Let's assume we re-parse for safety if date is from `toLocaleDateString`.
          const dateA = new Date(a.date); // This might fail if `a.date` is like "12/25/2023" in some locales
          const dateB = new Date(b.date); // If so, you'd need a more robust parsing or store original date.
          return dateB.getTime() - dateA.getTime();
        });

      return {
        workoutExerciseId: workoutExercise.id,
        dateGroups
      };
    }).filter(group => group.dateGroups.length > 0); // Only return workout exercises with sets
  }
}