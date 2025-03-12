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
    TagModule
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
    
    // Sort weeks by week number
    this.allWeeks.sort((a, b) => a.weekNumber - b.weekNumber);
  }
  
  // Combine started and not-started workouts
  combineWorkouts(notStartedWorkouts: any[], startedWorkouts: any[]): any[] {
    const combinedWorkouts: any[] = [];
    const startedWorkoutMap = new Map();
    
    // Map started workouts by their workoutId
    startedWorkouts.forEach(startedWorkout => {
      startedWorkoutMap.set(startedWorkout.workoutId, startedWorkout);
    });
    
    // Process not-started workouts
    notStartedWorkouts.forEach(notStartedWorkout => {
      if (startedWorkoutMap.has(notStartedWorkout.id)) {
        // This workout exists in both started and not-started data
        const startedWorkout = startedWorkoutMap.get(notStartedWorkout.id);
        startedWorkoutMap.delete(notStartedWorkout.id); // Remove from map to track processed workouts
        
        combinedWorkouts.push({
          ...notStartedWorkout,
          ...startedWorkout,
          id: notStartedWorkout.id,
          isStarted: true,
          // Process exercises
          workoutExercises: this.combineExercises(
            notStartedWorkout.workoutExercises || [], 
            startedWorkout.workoutExercises || []
          )
        });
      } else {
        // This is purely a not-started workout
        combinedWorkouts.push({
          ...notStartedWorkout,
          isStarted: false,
          workoutExercises: notStartedWorkout.workoutExercises || []
        });
      }
    });
    
    // Add any remaining started workouts
    startedWorkoutMap.forEach(startedWorkout => {
      combinedWorkouts.push({
        ...startedWorkout,
        id: startedWorkout.workoutId,
        isStarted: true,
        workoutExercises: this.combineExercises(
          startedWorkout.workoutExercises || [], 
          startedWorkout.workoutExercises || []
        )
      });
    });
    
    return combinedWorkouts;
  }
  
  // Combine started and not-started exercises
  combineExercises(notStartedExercises: any[], startedExercises: any[]): any[] {
    const combinedExercises: any[] = [];
    const startedExerciseMap = new Map();
    
    // Map started exercises by their exerciseId
    startedExercises.forEach(startedExercise => {
      startedExerciseMap.set(startedExercise.exerciseId, startedExercise);
    });
    
    // Process not-started exercises
    notStartedExercises.forEach(notStartedExercise => {
      if (startedExerciseMap.has(notStartedExercise.exerciseId)) {
        // This exercise exists in both started and not-started data
        const startedExercise = startedExerciseMap.get(notStartedExercise.exerciseId);
        startedExerciseMap.delete(notStartedExercise.exerciseId);
        
        combinedExercises.push({
          ...notStartedExercise,
          ...startedExercise,
          isStarted: true,
          allSets: this.combineSets(
            notStartedExercise.sets || [], 
            startedExercise.doneSets || []
          )
        });
      } else {
        // This is purely a not-started exercise
        combinedExercises.push({
          ...notStartedExercise,
          isStarted: false,
          allSets: notStartedExercise.sets || []
        });
      }
    });
    
    // Add any remaining started exercises
    startedExerciseMap.forEach(startedExercise => {
      combinedExercises.push({
        ...startedExercise,
        isStarted: true,
        allSets: this.combineSets(
          startedExercise.sets || [], 
          startedExercise.doneSets || []
        )
      });
    });
    console.log(combinedExercises);
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
    for (let i = completedSets.length; i < plannedSets.length; i++) {
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

  toggleExerciseDetails(workoutId: any, exerciseId: any): void {
    const key = `${workoutId}-${exerciseId}`;
    if (this.expandedExercises.has(key)) {
      this.expandedExercises.delete(key);
    } else {
      this.expandedExercises.add(key);
    }
  }
  
  isExerciseExpanded(workoutId: any, exerciseId: any): boolean {
    return this.expandedExercises.has(`${workoutId}-${exerciseId}`);
  }
  
  toggleWorkoutDetails(weekId: any, workoutId: any): void {
    const key = `${weekId}-${workoutId}`;
    if (this.expandedWorkouts.has(key)) {
      this.expandedWorkouts.delete(key);
    } else {
      this.expandedWorkouts.add(key);
    }
  }
  
  isWorkoutExpanded(weekId: any, workoutId: any): boolean {
    return this.expandedWorkouts.has(`${weekId}-${workoutId}`);
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
  
  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Not Started': return 'warning';
      default: return 'secondary';
    }
  }

  printHistory(): void {
    window.print();
  }
  
  exportHistoryData(): void {
    if (!this.programHistory) return;
    
    const dataStr = JSON.stringify(this.programHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${this.programHistory.title.replace(/\s+/g, '_')}_history.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
  
  navigateToProgram(): void {
    if (this.programHistory && this.programHistory.programId) {
      this.router.navigate(['/programs/details', this.programHistory.programId]);
    }
  }
}