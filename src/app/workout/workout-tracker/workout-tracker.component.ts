import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { AccordionModule } from 'primeng/accordion';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ProgramService } from '../../program/program-service/program.service';
import { NextWorkout } from '../next-workout';
import { WorkoutService } from '../workout.service';
import { WorkoutExercise, WorkoutExerciseSet } from '../../program/program.model';


@Component({
  selector: 'app-workout-tracker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    CardModule,
    DividerModule,
    AccordionModule,
    ProgressBarModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './workout-tracker.component.html',
  styleUrls: ['./workout-tracker.component.css']
})
export class WorkoutTrackerComponent implements OnInit {
  workoutId: number | null = null;
  currentWorkout: NextWorkout | null = null;
  workoutForm: FormGroup;
  loading = false;
  submitting = false;
  showSummary = false;
  
  // Track current progress
  currentExerciseIndex = 0;
  currentSetIndex = 0;
  totalExercises = 0;
  totalSets = 0;
  progress = 0;

  // Timer
  restTimer: any = null;
  restTimeRemaining = 0;
  showRestTimer = false;
  
  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private workoutService: WorkoutService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.workoutForm = this.fb.group({
      exercises: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const programId = parseInt(params.get('id')??"0");
      if (programId) {
        this.loadNextWorkout(programId);
      } else {
        this.loading = false;
      }
    });
  }
  
  get exercises(): FormArray {
    return this.workoutForm.get('exercises') as FormArray;
  }
  
  
  loadNextWorkout(programId:number): void {
    this.loading = true;
    this.workoutService.getNextWorkout(programId).subscribe({
      next: (nextWorkout: NextWorkout) => {
        this.currentWorkout = nextWorkout;
        
        if (nextWorkout.action === 'start' || nextWorkout.action === 'continue') {
          this.initializeForm();
          this.calculateTotals();
        } else {
          // Handle program completed or other states
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: nextWorkout.message || 'No workout available'
          });
          
          // Redirect to dashboard after delay if no workout to do
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        }
        
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load next workout'
        });
        console.error('Error loading next workout:', error);
      }
    });
  }
  
  initializeForm(): void {
    if (!this.currentWorkout || !this.currentWorkout.startedWorkout) {
      return;
    }
    
    const startedWorkout = this.currentWorkout.startedWorkout;
    
    // Clear existing form
    while (this.exercises.length) {
      this.exercises.removeAt(0);
    }
    
    // Create form structure based on the workout data
    startedWorkout.workout.workoutExercises.forEach((exercise: WorkoutExercise) => {
      const exerciseGroup = this.fb.group({
        id: [exercise.id],
        exerciseTitle: [exercise.exercise.title],
        exerciseDescription: [exercise.exercise.description],
        restTime: [{ min: exercise.minimumRestTime, max: exercise.maximumRestTime }],
        sets: this.fb.array([])
      });
      
      const setsArray = exerciseGroup.get('sets') as FormArray;
      
      exercise.sets.forEach((set: WorkoutExerciseSet) => {
        // Find if this set was already completed in the startedWorkout
        const completedSet = startedWorkout.doneSets.find(
          doneSet => doneSet.set.id === set.id && doneSet.workoutExercise.id === exercise.id
        );
        
        const setGroup = this.fb.group({
          id: [set.id],
          volumeMetric: [set.volumeMetric],
          intensityMetric: [set.intensityMetric],
          volumeRange: [{ 
            min: set.volume.minimumVolume, 
            max: set.volume.maximumVolume 
          }],
          intensityRange: [{ 
            min: set.intensity.minimumIntensity, 
            max: set.intensity.maximumIntensity 
          }],
          completed: [!!completedSet],
          actualVolume: [completedSet ? completedSet.volume : set.volume.minimumVolume],
          actualIntensity: [completedSet ? completedSet.intensity : set.intensity.minimumIntensity],
          weightLifted: [completedSet ? completedSet.weightLifted : null]
        });
        
        setsArray.push(setGroup);
      });
      
      this.exercises.push(exerciseGroup);
    });
  }
  
  calculateTotals(): void {
    if (!this.currentWorkout || !this.currentWorkout.startedWorkout) {
      return;
    }
    
    const startedWorkout = this.currentWorkout.startedWorkout;
    this.totalExercises = startedWorkout.workout.workoutExercises.length;
    
    this.totalSets = startedWorkout.workout.workoutExercises.reduce(
      (total: number, exercise: WorkoutExercise) => total + exercise.sets.length, 0
    );
    
    this.updateProgress();
  }
  
  updateProgress(): void {
    let completedSets = 0;
    const exerciseGroups = this.exercises.controls;
    
    for (const exerciseGroup of exerciseGroups) {
      const setsArray = exerciseGroup.get('sets') as FormArray;
      for (const setControl of setsArray.controls) {
        if (setControl.get('completed')?.value) {
          completedSets++;
        }
      }
    }
    
    this.progress = this.totalSets > 0 ? (completedSets / this.totalSets) * 100 : 0;
  }
  
  getExerciseSets(exerciseIndex: number): FormArray {
    return this.exercises.at(exerciseIndex).get('sets') as FormArray;
  }
  
  completeSet(exerciseIndex: number, setIndex: number): void {
    const setControl = this.getExerciseSets(exerciseIndex).at(setIndex);
    setControl.get('completed')?.setValue(true);
    
    this.updateProgress();
    
    // Auto-navigate to next set or exercise
    const currentSetsArray = this.getExerciseSets(exerciseIndex);
    
    // If there are more sets in this exercise
    if (setIndex < currentSetsArray.length - 1) {
      this.currentSetIndex = setIndex + 1;
      this.startRestTimer(exerciseIndex);
    } else {
      // Move to the next exercise
      if (exerciseIndex < this.exercises.length - 1) {
        this.currentExerciseIndex = exerciseIndex + 1;
        this.currentSetIndex = 0;
        this.startRestTimer(exerciseIndex);
      } else {
        // Workout completed
        this.messageService.add({
          severity: 'success',
          summary: 'Workout Complete',
          detail: 'All exercises completed! Ready to submit your workout.'
        });
      }
    }
  }
  
  startRestTimer(exerciseIndex: number): void {
    const exerciseControl = this.exercises.at(exerciseIndex);
    const restTime = exerciseControl.get('restTime')?.value;
    
    if (restTime && restTime.min > 0) {
      // Use the minimum rest time for the timer
      this.restTimeRemaining = restTime.min;
      this.showRestTimer = true;
      
      this.restTimer = setInterval(() => {
        this.restTimeRemaining--;
        if (this.restTimeRemaining <= 0) {
          this.stopRestTimer();
          this.messageService.add({
            severity: 'info',
            summary: 'Rest Complete',
            detail: 'Time to start your next set!'
          });
        }
      }, 1000);
    }
  }
  
  stopRestTimer(): void {
    if (this.restTimer) {
      clearInterval(this.restTimer);
      this.restTimer = null;
      this.showRestTimer = false;
    }
  }
  
  skipRestTimer(): void {
    this.stopRestTimer();
  }
  
  isVolumeInRange(exerciseIndex: number, setIndex: number): boolean {
    const setControl = this.getExerciseSets(exerciseIndex).at(setIndex);
    const actualVolume = setControl.get('actualVolume')?.value;
    const volumeRange = setControl.get('volumeRange')?.value;
    
    if (actualVolume && volumeRange) {
      return actualVolume >= volumeRange.min && actualVolume <= volumeRange.max;
    }
    return true;
  }
  
  isIntensityInRange(exerciseIndex: number, setIndex: number): boolean {
    const setControl = this.getExerciseSets(exerciseIndex).at(setIndex);
    const actualIntensity = setControl.get('actualIntensity')?.value;
    const intensityRange = setControl.get('intensityRange')?.value;
    
    if (actualIntensity && intensityRange) {
      return actualIntensity >= intensityRange.min && actualIntensity <= intensityRange.max;
    }
    return true;
  }
  
  openSummary(): void {
    this.showSummary = true;
  }
  
  submitWorkout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to submit this workout?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveWorkout();
      }
    });
  }
  
  saveWorkout(): void {
    if (!this.currentWorkout || !this.currentWorkout.startedWorkout) {
      return;
    }
    
    this.submitting = true;
    
    // Prepare the data for submission
    const doneSets: any[] = [];
    
    this.exercises.controls.forEach((exerciseControl, exerciseIndex) => {
      const exerciseId = exerciseControl.get('id')?.value;
      const setsArray = exerciseControl.get('sets') as FormArray;
      
      setsArray.controls.forEach((setControl, setIndex) => {
        if (setControl.get('completed')?.value) {
          doneSets.push({
            workoutExerciseId: exerciseId,
            setId: setControl.get('id')?.value,
            volume: setControl.get('actualVolume')?.value,
            intensity: setControl.get('actualIntensity')?.value,
            weightLifted: setControl.get('weightLifted')?.value
          });
        }
      });
    });
    
    const startedWorkoutId = this.currentWorkout.startedWorkout.id;
    
    const historyData = {
      startedWorkoutId: startedWorkoutId,
      doneSets: doneSets,
      finished: this.progress >= 100
    };
    
    // this.workoutService.completeWorkout(historyData).subscribe({
    //   next: (response: any) => {
    //     this.submitting = false;
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Workout saved successfully'
    //     });
        
    //     // Navigate back to workout list or dashboard
    //     setTimeout(() => {
    //       this.router.navigate(['/dashboard']);
    //     }, 2000);
    //   },
    //   error: (error: any) => {
    //     this.submitting = false;
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Failed to save workout history'
    //     });
    //     console.error('Error saving workout history:', error);
    //   }
    // });
  }
  
  cancelWorkout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel this workout? All progress will be lost.',
      header: 'Cancel Workout',
      icon: 'pi pi-times',
      accept: () => {
        this.router.navigate(['/dashboard']);
      }
    });
  }
  
  isExerciseCompleted(exerciseIndex: number): boolean {
    const exerciseSets = this.getExerciseSets(exerciseIndex);
    for (let i = 0; i < exerciseSets.length; i++) {
      if (!exerciseSets.at(i).get('completed')?.value) {
        return false;
      }
    }
    return exerciseSets.length > 0;
  }
}