import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabsModule } from 'primeng/tabs';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { MessageService } from 'primeng/api';
import { ProgramService } from '../program-service/program.service';
import { CalendarModule } from 'primeng/calendar';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { Workout, WorkoutExerciseSet } from '../program.model';
import { DialogModule } from 'primeng/dialog';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-program-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    TabsModule,
    PanelModule,
    CardModule,
    TableModule,
    ButtonModule,
    AccordionModule,
    ConfirmPopupModule,
    ToastModule,
    RatingModule,
    DividerModule,
    InputTextModule,
    CalendarModule,
    ChipModule,
    TagModule,
    DialogModule
  ],
  templateUrl: './program-history.component.html',
  styleUrl: './program-history.component.css',
  providers: [MessageService]
})
export class ProgramHistoryComponent implements OnInit {
  startedProgramId: string | null = null;
  programHistory: any = null; // Will be ProgramHistoryDTO
  loading = true;
  apiUrl: string;
  activeWeekTab: string = '0';
  expandedExercises: Set<string> = new Set();
  expandedWorkouts: Set<string> = new Set();

  displayDescriptionDialog: boolean = false;
  selectedWorkoutDescription: string = '';
  selectedWorkoutTitle: string = '';

  // New properties to store combined data
  allWeeks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService,
    private messageService: MessageService
  ) {
    this.apiUrl = programService.apiUrl;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.startedProgramId = params.get('id');
      if (this.startedProgramId) {
        this.loadProgramHistory(this.startedProgramId);
      } else {
        this.loading = false;
      }
    });
  }

  loadProgramHistory(id: string): void {
    this.loading = true;
    this.programService.getProgramHistory(parseInt(id)).subscribe({
      next: (data) => {
        this.programHistory = data;
        this.loading = false;
        console.log(this.programHistory);

        // Process and organize the data correctly
        this.processWeeksData();

        if (this.allWeeks.length > 0) {
          this.activeWeekTab = '0';
        }
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load program history details'
        });
        console.error('Error loading program history:', error);
      }
    });
  }

  // Process and organize weeks data by combining started and not-started weeks
  processWeeksData(): void {
    this.allWeeks = [];

    // Add started weeks
    if (this.programHistory?.startedWeeks?.length) {
      this.programHistory.startedWeeks.forEach((startedWeek: any, index: number) => {
        const weekNumber = startedWeek.weekNumber || index + 1;

        this.allWeeks.push({
          ...startedWeek,
          weekNumber: weekNumber,
          isStarted: true,
          allWorkouts: this.combineWorkouts(
            startedWeek.workouts || [],
            startedWeek.startedWorkouts || []
          )
        });
      });
    }
    // Add not-started weeks
    if (this.programHistory?.weeks?.length) {
      this.programHistory.weeks.forEach((notStartedWeek: any, index: number) => {
        // Assign week number if not present
        const weekNumber = notStartedWeek.weekNumber || index + 1;

        this.allWeeks.push({
          ...notStartedWeek,
          weekNumber: weekNumber,
          isStarted: false,
          allWorkouts: notStartedWeek.workouts || []
        });
      });
    }



    
  }

  // Combine started and not-started workouts
  combineWorkouts(notStartedWorkouts: any[], startedWorkouts: any[]): any[] {
    const combinedWorkouts: any[] = [];



    // Add any remaining started workouts
    startedWorkouts.forEach(startedWorkout => {
      combinedWorkouts.push({
        ...startedWorkout,
        id: startedWorkout.id,
        isStarted: true,
        workoutExercises: this.combineExercises(
          startedWorkout.workoutExercises
        )
      });
    });
    notStartedWorkouts.forEach(notStartedWorkout => {
      combinedWorkouts.push({
        ...notStartedWorkout,
        id: notStartedWorkout.id,
        isStarted: false,
        workoutExercises: this.combineExercises(
          notStartedWorkout.workoutExercises
        )
      });
    });

    return combinedWorkouts;
  }

  // Combine started and not-started exercises
  combineExercises(exercises: any[]): any[] {
    const combinedExercises: any[] = [];
    exercises.forEach(exercise => {
      // Determine if the exercise is actually started
      // An exercise is considered started if it has any done sets
      const hasDoneSets = (exercise.doneSets || []).length > 0;

      combinedExercises.push({
        ...exercise,
        isStarted: hasDoneSets, // Only mark as started if there are completed sets
        allSets: this.combineSets(
          exercise.sets || [],
          exercise.doneSets || []
        )
      });
    });
    return combinedExercises;
  }

  // Combine sets with started and not-started logic
  combineSets(plannedSets: any[], completedSets: any[]): any[] {
    const allSets = [];

    // Add completed sets first
    for (let i = 0; i < completedSets.length; i++) {
      allSets.push({
        ...completedSets[i],
        isCompleted: true,
        // Include planned data if available
        ...(i < plannedSets.length ? plannedSets[i] : {})
      });
    }

    // Add remaining planned sets
    for (let i = 0; i < plannedSets.length; i++) {
      allSets.push({
        ...plannedSets[i],
        isCompleted: false
      });
    }

    return allSets;
  }

  // Get all weeks (both started and not started)
  getAllWeeks(): any[] {
    return this.allWeeks;
  }

  // Get started workouts for a specific week
  getStartedWorkoutsForWeek(week: any): any[] {
    if (!week || !week.allWorkouts) {
      return [];
    }
    return week.allWorkouts.filter((workout: any) => workout.isStarted);
  }

  // Get not started workouts for a specific week
  getNotStartedWorkoutsForWeek(week: any): any[] {
    if (!week || !week.allWorkouts) {
      return [];
    }
    return week.allWorkouts.filter((workout: any) => !workout.isStarted);
  }

  // Check if a week has any workouts (either started or not started)
  hasAnyWorkoutsForWeek(week: any): boolean {
    return week && week.allWorkouts && week.allWorkouts.length > 0;
  }

  // Get remaining planned sets for an exercise
  getRemainingPlannedSets(exercise: any): any[] {
    if (!exercise || !exercise.allSets) {
      return [];
    }
    return exercise.allSets.filter((set: any) => !set.isCompleted);
  }

  getTotalWorkouts(): number {
    return this.allWeeks.reduce((total: number, week: any) => {
      return total + (week.allWorkouts?.length || 0);
    }, 0);
  }

  getTotalExercises(): number {
    return this.allWeeks.reduce((total: number, week: any) => {
      if (!week.allWorkouts) return total;

      return total + week.allWorkouts.reduce((workoutTotal: number, workout: any) => {
        return workoutTotal + (workout.workoutExercises?.length || 0);
      }, 0);
    }, 0);
  }

  getTotalCompletedSets(): number {
    return this.allWeeks.reduce((total: number, week: any) => {
      if (!week.allWorkouts) return total;

      return total + week.allWorkouts.reduce((workoutTotal: number, workout: any) => {
        if (!workout.workoutExercises) return workoutTotal;

        return workoutTotal + workout.workoutExercises.reduce((exerciseTotal: number, exercise: any) => {
          if (!exercise.allSets) return exerciseTotal;

          return exerciseTotal + exercise.allSets.filter((set: any) => set.isCompleted).length;
        }, 0);
      }, 0);
    }, 0);
  }

  getTotalPlannedSets(): number {
    return this.allWeeks.reduce((total: number, week: any) => {
      if (!week.allWorkouts) return total;

      return total + week.allWorkouts.reduce((workoutTotal: number, workout: any) => {
        if (!workout.workoutExercises) return workoutTotal;

        return workoutTotal + workout.workoutExercises.reduce((exerciseTotal: number, exercise: any) => {
          return exerciseTotal + (exercise.allSets?.length || 0);
        }, 0);
      }, 0);
    }, 0);
  }

  getTotalWeightLifted(): number {
    return this.allWeeks.reduce((total: number, week: any) => {
      if (!week.allWorkouts) return total;

      return total + week.allWorkouts.reduce((workoutTotal: number, workout: any) => {
        if (!workout.workoutExercises) return workoutTotal;

        return workoutTotal + workout.workoutExercises.reduce((exerciseTotal: number, exercise: any) => {
          if (!exercise.allSets) return exerciseTotal;

          return exerciseTotal + exercise.allSets.reduce((setTotal: number, set: any) => {
            return setTotal + (set.isCompleted ? (set.weightLifted || 0) : 0);
          }, 0);
        }, 0);
      }, 0);
    }, 0);
  }

  getCompletionPercentage(): number {
    const totalSets = this.getTotalPlannedSets();
    const completedSets = this.getTotalCompletedSets();

    if (totalSets === 0) return 0;
    return Math.round((completedSets / totalSets) * 100);
  }




  // Toggle workout expansion state
  toggleWorkoutDetails(workoutId: string): void {
    if (this.expandedWorkouts.has(workoutId)) {
      this.expandedWorkouts.delete(workoutId);
    } else {
      this.expandedWorkouts.add(workoutId);
    }
  }

  // Check if a workout is expanded
  isWorkoutExpanded(workoutId: string): boolean {
    return this.expandedWorkouts.has(workoutId);
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  getWeekStatus(week: any): string {
    if (week.finished) {
      return 'Completed';
    } else if (week.isStarted) {
      return 'In Progress';
    } else {
      return 'Not Started';
    }
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'secondary' {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Not Started': return 'warn';
      default: return 'secondary';
    }
  }

  printHistory(): void {
    window.print();
  }

  exportHistoryData(): void {
    if (!this.programHistory) return;
  
    // Create workbook
    const wb = XLSX.utils.book_new();
  
    // Program Overview Sheet
    const programOverview = [{
      'Program Name': this.programHistory.title,
      'Creator': this.programHistory.creator?.name || 'Unknown',
      'Started Date': this.formatDate(this.programHistory.startDate),
      'Completion Status': `${this.getCompletionPercentage()}% Completed`,
      'Total Workouts': this.getTotalWorkouts(),
      'Total Exercises': this.getTotalExercises(),
      'Completed Sets': this.getTotalCompletedSets(),
      'Total Sets': this.getTotalPlannedSets(),
      'Total Weight Lifted': `${this.getTotalWeightLifted()} kg`
    }];
  
    const overviewSheet = XLSX.utils.json_to_sheet(programOverview);
  
    // Set column widths for overview sheet
    const overviewCols = [
      { wch: 15 }, // Program Name
      { wch: 15 }, // Creator
      { wch: 15 }, // Started Date
      { wch: 18 }, // Completion Status
      { wch: 15 }, // Total Workouts
      { wch: 15 }, // Total Exercises
      { wch: 15 }, // Completed Sets
      { wch: 12 }, // Total Sets
      { wch: 18 }  // Total Weight Lifted
    ];
  
    overviewSheet['!cols'] = overviewCols;
    XLSX.utils.book_append_sheet(wb, overviewSheet, 'Program Overview');
  
    // Process each week
    this.allWeeks.forEach((week, weekIndex) => {
      // Use aoa (array of arrays) for more control over formatting
      const weekData = [];
      const merges = [];
  
      // Add sheet title
      weekData.push([`Week ${weekIndex + 1} Training History`]);
      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } });
  
      // Add week status info
      weekData.push([]);
      weekData.push(['Week Status:', this.getWeekStatus(week)]);
      weekData.push(['Start Date:', this.formatDate(week.startDate)]);
      weekData.push(['Completion Date:', this.formatDate(week.doneDate)]);
      weekData.push([]);
  
      if (week.allWorkouts && week.allWorkouts.length > 0) {
        week.allWorkouts.forEach((workout: { title: any; number: any; isStarted: any; finished: any; description: any; workoutExercises: any[]; }, workoutIndex: number) => {
          // Add workout header
          const workoutRow = weekData.length;
          weekData.push([`${workout.title || 'Workout ' + (workoutIndex + 1)} (${workout.number || `Day ${workoutIndex + 1}`}) - ${workout.isStarted ? (workout.finished ? 'Completed' : 'In Progress') : 'Not Started'}`]);
          merges.push({ s: { r: workoutRow, c: 0 }, e: { r: workoutRow, c: 8 } });
  
          // Add workout description if available
          if (workout.description) {
            const descRow = weekData.length;
            weekData.push([`Description: ${workout.description}`]);
            merges.push({ s: { r: descRow, c: 0 }, e: { r: descRow, c: 8 } });
          }
  
          if (workout.workoutExercises && workout.workoutExercises.length > 0) {
            workout.workoutExercises.forEach((exercise, exerciseIndex) => {
              // Add exercise header
              weekData.push([]);
              const exerciseRow = weekData.length;
              weekData.push([`Exercise ${exerciseIndex + 1}: ${exercise.title || exercise.exercise.title || 'Exercise ' + (exerciseIndex + 1)} - ${this.getExerciseStatus(exercise)}`]);
              merges.push({ s: { r: exerciseRow, c: 0 }, e: { r: exerciseRow, c: 8 } });
  
              // Add completed sets section if available
              if (exercise.doneSets && exercise.doneSets.length > 0) {
                weekData.push(['Completed Sets:']);
                weekData.push(['Set #', 'Volume', 'Volume Unit', 'Intensity', 'Intensity Unit', 'Weight', 'Date', 'Notes']);
  
                exercise.doneSets.forEach((doneSet: { volume: any; setDetails: { volumeMetric: { metricSymbol: any; }; intensityMetric: { metricSymbol: any; }; }; intensity: any; weightLifted: any; date: string | Date; notes: any; }, setIndex: number) => {
                  weekData.push([
                    setIndex + 1,
                    doneSet.volume,
                    doneSet.setDetails?.volumeMetric?.metricSymbol || '',
                    doneSet.intensity,
                    doneSet.setDetails?.intensityMetric?.metricSymbol || '',
                    doneSet.weightLifted ? `${doneSet.weightLifted} kg` : 'N/A',
                    this.formatDate(doneSet.date),
                    doneSet.notes || ''
                  ]);
                });
              } else {
                weekData.push(['No sets completed for this exercise yet.']);
                merges.push({ s: { r: weekData.length - 1, c: 0 }, e: { r: weekData.length - 1, c: 8 } });
              }
  
              // Add remaining planned sets section
              const remainingPlannedSets = this.getRemainingPlannedSets(exercise);
              if (remainingPlannedSets.length > 0) {
                weekData.push([]);
                weekData.push(['Planned Sets:']);
                weekData.push(['Set #', 'Volume', 'Volume Unit', 'Intensity', 'Intensity Unit', '', '', '']);
  
                remainingPlannedSets.forEach((plannedSet, setIndex) => {
                  const volumeValue = this.isVolumeRange(plannedSet) ?
                    `${plannedSet.volume.minimumVolume}-${plannedSet.volume.maximumVolume}` :
                    `${plannedSet.volume.maximumVolume}`;
  
                  const intensityValue = this.isIntensityRange(plannedSet) ?
                    `${plannedSet.intensity.minimumIntensity}-${plannedSet.intensity.maximumIntensity}` :
                    `${plannedSet.intensity.maximumIntensity}`;
  
                  weekData.push([
                    setIndex + (exercise.doneSets?.length || 0) + 1,
                    volumeValue,
                    plannedSet.volumeMetric.metricSymbol,
                    intensityValue,
                    plannedSet.intensityMetric.metricSymbol,
                    '', '', ''
                  ]);
                });
              } else if (exercise.doneSets && exercise.doneSets.length > 0) {
                weekData.push([]);
                weekData.push(['All planned sets have been completed!']);
                merges.push({ s: { r: weekData.length - 1, c: 0 }, e: { r: weekData.length - 1, c: 8 } });
              }
  
              // Add empty row for spacing
              weekData.push([]);
            });
          } else {
            weekData.push(['No exercises defined for this workout.']);
            merges.push({ s: { r: weekData.length - 1, c: 0 }, e: { r: weekData.length - 1, c: 8 } });
            weekData.push([]);
          }
  
          // Add empty row between workouts
          weekData.push([]);
        });
      } else {
        weekData.push(['No workouts defined for this week.']);
        merges.push({ s: { r: weekData.length - 1, c: 0 }, e: { r: weekData.length - 1, c: 8 } });
      }
  
      // Create the sheet from the array data
      const weekSheet = XLSX.utils.aoa_to_sheet(weekData);
  
      // Add the merges to the sheet
      weekSheet['!merges'] = merges;
  
      // Set column widths
      const weekCols = [
        { wch: 8 },  // Set #
        { wch: 10 }, // Volume
        { wch: 12 }, // Volume Unit
        { wch: 10 }, // Intensity
        { wch: 12 }, // Intensity Unit
        { wch: 10 }, // Weight
        { wch: 15 }, // Date
        { wch: 20 }  // Notes
      ];
      weekSheet['!cols'] = weekCols;
  
      // Apply styling for title row
      weekSheet['A1'] = {
        v: weekData[0][0], t: 's', s: {
          font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "2F5597" } },
          alignment: { horizontal: "center", vertical: "center" }
        }
      };
  
      // Add the sheet to the workbook
      XLSX.utils.book_append_sheet(wb, weekSheet, `Week ${weekIndex + 1}`);
    });
  
    // Progress Statistics Sheet
    const progressStats = [];
    progressStats.push(['Program Progress Statistics']);
    progressStats.push([]);
    progressStats.push(['Completion Percentage', `${this.getCompletionPercentage()}%`]);
    progressStats.push(['Total Completed Sets', this.getTotalCompletedSets()]);
    progressStats.push(['Total Planned Sets', this.getTotalPlannedSets()]);
    progressStats.push(['Total Weight Lifted', `${this.getTotalWeightLifted()} kg`]);
    
    const statsSheet = XLSX.utils.aoa_to_sheet(progressStats);
    
    // Apply styling for title row in stats sheet
    statsSheet['A1'] = {
      v: progressStats[0][0], t: 's', s: {
        font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2F5597" } },
        alignment: { horizontal: "center", vertical: "center" }
      }
    };
    
    // Add merge for the title
    statsSheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
    
    // Set column widths for stats sheet
    statsSheet['!cols'] = [
      { wch: 25 },
      { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(wb, statsSheet, 'Progress Statistics');
  
    // Generate Excel file with styling
    const excelOptions: any = {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    };
  
    const excelBuffer = XLSX.write(wb, excelOptions);
  
    // Save to file
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  
    const fileName = `${this.programHistory.title.replace(/\s+/g, '_')}_history.xlsx`;
  
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  
    window.URL.revokeObjectURL(url);
  
    this.messageService.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: `History exported as Excel file: ${fileName}`
    });
  }

  navigateToProgram(): void {
    if (this.programHistory && this.programHistory.programId) {
      this.router.navigate(['/programs/', this.programHistory.programId]);
    }
  }
  isVolumeRange(set: any): boolean {
    return set.volumeMetric?.range || false;
  }
  isIntensityRange(set: any): boolean {
    return set.intensityMetric?.range || false;
  }
  // Add these methods to your component class

  /**
   * Gets the display status for an exercise
   */
  getExerciseStatus(exercise: any): string {
    if (!exercise.doneSets || exercise.doneSets.length === 0) {
      return 'Not Started';
    } else if (exercise.doneSets.length === exercise.sets.length) {
      return 'Completed';
    } else {
      return 'In Progress';
    }
  }

  showDescription(workout: Workout): void {
    this.selectedWorkoutTitle = workout.title || 'Workout Details';
    this.selectedWorkoutDescription = workout.description || 'No description available.';
    this.displayDescriptionDialog = true;
  }

  /**
   * Gets the appropriate severity class for the p-tag component
   */
  getExerciseSeverity(exercise: any): 'warn' | 'success' | 'info' {
    if (!exercise.doneSets || exercise.doneSets.length === 0) {
      return 'warn';
    } else if (exercise.sets.length == 0) {
      return 'success';
    } else {
      return 'info';
    }
  }
}