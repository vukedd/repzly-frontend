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
    CardModule
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
    private exerciseService:ExerciseService
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
  processWorkoutExercises(): { 
    workoutExerciseId: number, 
    dateGroups: GroupedSetsByDate[]
  }[] {
    if (!this.exerciseHistory) return [];
    
    return this.exerciseHistory.workoutExercises.map(workoutExercise => {
      // Group this workout exercise's sets by date
      const groupedByDate: Map<string, DoneSetsHistoryDTO[]> = new Map();
      
      workoutExercise.doneSets.forEach(set => {
        const dateStr = this.formatDate(set.date);
        if (!groupedByDate.has(dateStr)) {
          groupedByDate.set(dateStr, []);
        }
        groupedByDate.get(dateStr)?.push(set);
      });
      
      // Convert the map to an array and sort by date (newest first)
      const dateGroups = Array.from(groupedByDate.entries())
        .map(([date, sets]) => ({ date, sets }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return {
        workoutExerciseId: workoutExercise.id,
        dateGroups
      };
    }).filter(group => group.dateGroups.length > 0); // Only return workout exercises with sets
  }
}