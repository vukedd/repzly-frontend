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
import { DoneSet, NextWorkout } from '../next-workout';
import { WorkoutService } from '../workout.service';
import { WorkoutExercise, WorkoutExerciseSet } from '../../program/program.model';
import { CreateDoneSetDTO } from '../create-done-set-dto';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExerciseHistoryDialogComponent } from '../../exercise/exercise-history-dialog/exercise-history-dialog.component';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';


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
  providers: [MessageService, ConfirmationService, DialogService],
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
  private ref: DynamicDialogRef | undefined;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private workoutService: WorkoutService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) {
    this.workoutForm = this.fb.group({
      exercises: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const programId = parseInt(params.get('id') ?? "0");
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


  loadNextWorkout(programId: number): void {
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
    if (!this.currentWorkout || !this.currentWorkout.nextWorkoutDetails) {
      return;
    }

    const nextWorkoutDetails = this.currentWorkout.nextWorkoutDetails;

    // Clear existing form
    while (this.exercises.length) {
      this.exercises.removeAt(0);
    }

    // Create form structure based on the workout data
    nextWorkoutDetails.workout.workoutExercises.forEach((exercise: WorkoutExercise) => {
      const exerciseGroup = this.fb.group({
        id: [exercise.id],
        exerciseId: [exercise.exercise.id],
        exerciseTitle: [exercise.exercise.title],
        exerciseDescription: [exercise.exercise.description],
        restTime: [{ min: exercise.minimumRestTime, max: exercise.maximumRestTime }],
        sets: this.fb.array([])
      });

      const setsArray = exerciseGroup.get('sets') as FormArray;

      exercise.sets.forEach((set: WorkoutExerciseSet) => {
        // Find if this set was already completed in the nextWorkoutDetails
        const completedSet = nextWorkoutDetails.doneSets.find(
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
    if (!this.currentWorkout || !this.currentWorkout.nextWorkoutDetails) {
      return;
    }

    const nextWorkoutDetails = this.currentWorkout.nextWorkoutDetails;
    this.totalExercises = nextWorkoutDetails.workout.workoutExercises.length;

    this.totalSets = nextWorkoutDetails.workout.workoutExercises.reduce(
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
    const exerciseControl = this.exercises.at(exerciseIndex);

    // Prepare the DTO for the API call
    const doneSetDTO: CreateDoneSetDTO = {
      startedWorkoutId: this.currentWorkout?.nextWorkoutDetails?.id || 0,
      workoutExerciseId: exerciseControl.get('id')?.value,
      setId: setControl.get('id')?.value,
      volume: setControl.get('actualVolume')?.value,
      intensity: setControl.get('actualIntensity')?.value,
      weightLifted: setControl.get('weightLifted')?.value || 0
    };

    // Call the API
    this.workoutService.completeSet(doneSetDTO).subscribe({
      next: (response: DoneSet) => {
        // Mark set as completed in the UI
        setControl.get('completed')?.setValue(true);
        this.updateProgress();

        this.messageService.add({
          severity: 'success',
          summary: 'Set Completed'
        });
        this.currentWorkout?.nextWorkoutDetails?.doneSets.push(response);


        // Auto-navigate to next set or exercise logic
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
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to complete set'
        });
        console.error('Error completing set:', error);
      }
    });
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
    // Check if there are incomplete sets
    const totalSets = this.totalSets;
    const completedSets = this.countCompletedSets();
    const hasIncompleteSets = completedSets < totalSets;

    let confirmMessage = 'Are you sure you want to submit this workout?';

    // Customize message if there are incomplete sets
    if (hasIncompleteSets) {
      confirmMessage = `You have completed ${completedSets} out of ${totalSets} sets. Are you sure you want to submit this workout with incomplete sets?`;
    }

    this.confirmationService.confirm({
      message: confirmMessage,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveWorkout();
      }
    });
  }

  // Helper method to count completed sets
  countCompletedSets(): number {
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

    return completedSets;
  }

  saveWorkout(): void {
    if (!this.currentWorkout || !this.currentWorkout.nextWorkoutDetails) {
      return;
    }

    this.submitting = true;
    const nextWorkoutDetailsId = this.currentWorkout.nextWorkoutDetails.id;
    const startedProgramId = this.route.snapshot.params['id']; // Get the program ID from the route

    this.workoutService.completeWorkout(nextWorkoutDetailsId, startedProgramId).subscribe({
      next: (response) => {
        this.submitting = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Workout Submitted',
          detail: response.message
        });

        // Navigate back to dashboard after a short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.submitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to submit workout'
        });
        console.error('Error submitting workout:', error);
      }
    });
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
  uncompleteSet(exerciseIndex: number, setIndex: number): void {
    const setControl = this.getExerciseSets(exerciseIndex).at(setIndex);
    const exerciseControl = this.exercises.at(exerciseIndex);

    // Get the done set ID from the current workout
    const setId = setControl.get('id')?.value;
    const workoutExerciseId = exerciseControl.get('id')?.value;
    const nextWorkoutDetailsId = this.currentWorkout?.nextWorkoutDetails?.id || 0;

    // Find the done set ID by matching the workout exercise and set IDs
    const doneSet = this.currentWorkout?.nextWorkoutDetails?.doneSets.find(
      ds => ds.set.id === setId && ds.workoutExercise.id === workoutExerciseId
    );

    if (!doneSet) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not find the completed set'
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Are you sure you want to undo this completed set?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.workoutService.uncompleteSet(nextWorkoutDetailsId, doneSet.id).subscribe({
          next: (response) => {
            // Mark set as not completed in the UI
            // Remove the done set from the array
            if (this.currentWorkout?.nextWorkoutDetails?.doneSets) {
              this.currentWorkout.nextWorkoutDetails.doneSets =
                this.currentWorkout.nextWorkoutDetails.doneSets.filter(ds => ds.id !== doneSet.id);
            }
            setControl.get('completed')?.setValue(false);
            this.updateProgress();

            this.messageService.add({
              severity: 'success',
              summary: 'Set Undone',
              detail: response.message
            });

          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to undo completed set'
            });
            console.error('Error uncompleting set:', error);
          }
        });
      }
    });
  }
  showHistoryDialog(exerciseId: any): void {
    // Check if the device is mobile using window width
    const isMobile = window.innerWidth < 768; // Common breakpoint for mobile
    
    this.ref = this.dialogService.open(ExerciseHistoryDialogComponent, {
      header: 'Exercise History',
      width: isMobile ? '100%' : '80%',
      height: isMobile ? '100vh' : '100vh',
      maximizable: true,
      closeOnEscape: true,
      dismissableMask: true,
      modal:true,
      data: {
        exerciseId: exerciseId.value
      },
    });
  }
  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}