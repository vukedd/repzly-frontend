import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DoneSet, NextWorkout } from '../next-workout';
import { WorkoutService, CreateSetDTO, ChangeExerciseOrderDTO } from '../workout.service';
import { ExerciseOverview, WorkoutExercise, WorkoutExerciseSet } from '../../program/program.model';
import { CreateDoneSetDTO } from '../create-done-set-dto';
import { ExerciseHistoryDialogComponent } from '../../exercise/exercise-history-dialog/exercise-history-dialog.component';
import { ExerciseService } from '../../exercise/exercise-service.service';
import { ExerciseOrderDialogComponent } from '../exercise-order-dialog/exercise-order-dialog.component';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SafePipe } from './safe-pipe';
import { MenuItem } from 'primeng/api';
import { Menu, MenuModule } from 'primeng/menu';
import { ToastsPositionService } from '../../layout/toasts/toasts-position.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-workout-tracker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DividerModule,
    ProgressBarModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    SelectModule,
    InputNumberModule,
    SafePipe,
    MenuModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService, DialogService],
  templateUrl: './workout-tracker.component.html',
  styleUrls: ['./workout-tracker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkoutTrackerComponent implements OnInit, OnDestroy {
  // Core workout data
  currentWorkout: NextWorkout | null = null;
  workoutForm: FormGroup;
  showInputButtons = false;
  private destroy$ = new Subject<void>();

  // UI state
  loading = true;
  submitting = false;
  showSummary = false;
  showExerciseChangeDialog = false;
  selectedExerciseIndex: number | null = null;
  selectedExerciseId: number | null = null;
  // Update the property type
  availableExercises: ExerciseOverview[] = [];

  // Progress tracking
  totalExercises = 0;
  totalSets = 0;
  progress = 0;

  // Timer state
  restTimer: ReturnType<typeof setInterval> | null = null;
  restTimeRemaining = 0;
  showRestTimer = false;

  // Workout duration tracking
  workoutStartTime: number | null = null;
  workoutDurationInterval: ReturnType<typeof setInterval> | null = null;
  workoutDurationSeconds = 0;
  workoutDurationDisplay = '00:00';

  showVideoDialog = false;
  currentVideoUrl: string | null = null;

  // Dialog reference
  private ref: DynamicDialogRef | undefined;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private workoutService: WorkoutService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private exerciseService: ExerciseService,
    private breakpointObserver: BreakpointObserver,
    public toastsPositionService: ToastsPositionService
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
    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.showInputButtons = result.matches;
      });
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
      this.ref = undefined;
    }
    this.stopRestTimer();
    this.stopWorkoutTimer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Form Access Methods ---

  get exercises(): FormArray {
    return this.workoutForm?.get('exercises') as FormArray ?? this.fb.array([]);
  }

  getExerciseControl(exerciseIndex: number): FormGroup | null {
    if (exerciseIndex < 0 || exerciseIndex >= this.exercises.length) {
      console.error(`Invalid exercise index requested: ${exerciseIndex}`);
      return null;
    }
    return this.exercises.at(exerciseIndex) as FormGroup;
  }

  getExerciseSets(exerciseIndex: number): FormArray | null {
    const exerciseControl = this.getExerciseControl(exerciseIndex);
    return exerciseControl ? exerciseControl.get('sets') as FormArray : null;
  }

  getExerciseSetsAt(exerciseControl: AbstractControl | null, index: number): AbstractControl | null {
    if (!exerciseControl) return null;
    const setsArray = exerciseControl.get('sets') as FormArray;
    return (setsArray && index >= 0 && index < setsArray.length) ? setsArray.at(index) : null;
  }

  // --- Workout Data Loading and Initialization ---

  loadNextWorkout(programId: number): void {
    this.loading = true;
    this.workoutService.getNextWorkout(programId).subscribe({
      next: (nextWorkout: NextWorkout) => {
        this.currentWorkout = nextWorkout;
        console.log(nextWorkout);

        if (nextWorkout.action === 'start' || nextWorkout.action === 'continue') {
          this.initializeForm();
          this.calculateTotals();
          this.startWorkoutTimer();

        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: nextWorkout.message || 'No workout available'
          });

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        }

        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading next workout:', error);
      }
    });
  }

  initializeForm(): void {
    if (!this.currentWorkout?.nextWorkoutDetails) return;

    const nextWorkoutDetails = this.currentWorkout.nextWorkoutDetails;

    // Clear existing form
    while (this.exercises.length) {
      this.exercises.removeAt(0);
    }

    // Create form structure based on the workout data
    nextWorkoutDetails.workoutExercises.forEach((exercise: WorkoutExercise) => {
      console.log(exercise);
      const exerciseGroup = this.fb.group({
        id: [exercise.id],
        exerciseId: [exercise.exercise.id],
        exerciseTitle: [exercise.exercise.title],
        exerciseDescription: [exercise.exercise.description],
        exerciseLink: [exercise.exercise.link],
        restTime: [{ min: exercise.minimumRestTime, max: exercise.maximumRestTime }],
        sets: this.fb.array([])
      });

      const setsArray = exerciseGroup.get('sets') as FormArray;

      // Add all the regular sets from the workout definition
      exercise.sets.forEach((set: WorkoutExerciseSet) => {
        // Find completed sets for this exercise and set
        const completedSets = nextWorkoutDetails.doneSets.filter(
          doneSet => doneSet.set.id === set.id && doneSet.workoutExercise.id === exercise.id
        );

        // If no completed sets, add just one regular set control
        if (completedSets.length === 0) {
          setsArray.push(this.createSetFormGroup(set, null, false));
        }
        // Otherwise, add a control for each completed set
        else {
          completedSets.forEach((doneSet, index) => {
            const isAdditional = index > 0; // First one is original, others are additional
            setsArray.push(this.createSetFormGroup(set, doneSet, isAdditional));
          });
        }
      });

      this.exercises.push(exerciseGroup);
    });

    this.calculateTotals();
  }

  private createSetFormGroup(set: WorkoutExerciseSet, doneSet: DoneSet | null, isAdditional: boolean): FormGroup {
    const isCompleted = !!doneSet;

    return this.fb.group({
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
      completed: [isCompleted],
      actualVolume: [{
        value: doneSet ? doneSet.volume : null,
        disabled: isCompleted
      }],
      actualIntensity: [{
        value: doneSet ? doneSet.intensity : null,
        disabled: isCompleted
      }],
      weightLifted: [{
        value: doneSet ? doneSet.weightLifted : null,
        disabled: isCompleted
      }],
      doneSetId: [doneSet ? doneSet.id : null],
      isAdditionalSet: [isAdditional]
    });
  }

  // --- Progress Tracking ---

  calculateTotals(): void {
    if (!this.currentWorkout?.nextWorkoutDetails) return;

    const nextWorkoutDetails = this.currentWorkout.nextWorkoutDetails;
    this.totalExercises = nextWorkoutDetails.workoutExercises.length;

    this.totalSets = nextWorkoutDetails.workoutExercises.reduce(
      (total: number, exercise: WorkoutExercise) => total + exercise.sets.length, 0
    );

    this.updateProgress();
  }

  updateProgress(): void {
    const completedSetsCount = this.countCompletedSets();
    this.progress = this.totalSets > 0 ? Math.round((completedSetsCount / this.totalSets) * 100) : 0;
  }

  countCompletedSets(): number {
    let completedCount = 0;
    this.exercises.controls.forEach(exerciseControl => {
      const setsArray = exerciseControl.get('sets') as FormArray;
      setsArray.controls.forEach(setControl => {
        if (setControl.get('completed')?.value === true) {
          completedCount++;
        }
      });
    });
    return completedCount;
  }

  isExerciseCompleted(exerciseIndex: number): boolean {
    const exerciseSets = this.getExerciseSets(exerciseIndex);
    if (!exerciseSets || exerciseSets.length === 0) {
      return false;
    }
    return exerciseSets.controls.every(setControl => setControl.get('completed')?.value === true);
  }

  // --- Set Completion Methods ---

  completeSet(exerciseIndex: number, setIndex: number): void {
    const exerciseControl = this.getExerciseControl(exerciseIndex);
    const setsArray = this.getExerciseSets(exerciseIndex);
    const setControl = setsArray?.at(setIndex);

    if (!exerciseControl || !setControl || !setsArray) {
      this.messageService.add({
        severity: 'error',
        summary: 'Internal Error',
        detail: 'Could not find set details.'
      });
      console.error(`Could not find exercise or set control for indices: ${exerciseIndex}, ${setIndex}`);
      return;
    }

    let weight = setControl.get('weightLifted')?.value;
    let volume = setControl.get('actualVolume')?.value;
    let intensity = setControl.get('actualIntensity')?.value;


    // Update form values if empty
    if (volume === null || volume === undefined || volume === '') {
      const volumeMax = setControl.get('volumeRange')?.value.max;
      setControl.get('actualVolume')?.setValue(volumeMax);
      volume = volumeMax;
    }

    if (intensity === null || intensity === undefined || intensity === '') {
      const intensityMax = setControl.get('intensityRange')?.value.max;
      setControl.get('actualIntensity')?.setValue(intensityMax);
      intensity = intensityMax;
    }

    if (weight === null || weight === undefined || weight === '') {
      setControl.get('weightLifted')?.setValue(0);
      weight = 0;
    }

    // Create the DTO
    const doneSetDTO: CreateDoneSetDTO = {
      startedWorkoutId: this.currentWorkout?.nextWorkoutDetails?.id || 0,
      workoutExerciseId: exerciseControl.get('id')?.value,
      setId: setControl.get('id')?.value,
      volume: Number(volume),
      intensity: Number(intensity),
      weightLifted: Number(weight)
    };

    if (!doneSetDTO.startedWorkoutId || !doneSetDTO.workoutExerciseId || !doneSetDTO.setId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Internal Error',
        detail: 'Missing required IDs to save set.'
      });
      console.error('Missing IDs for completeSet DTO:', doneSetDTO);
      return;
    }

    this.workoutService.completeSet(doneSetDTO).subscribe({
      next: (response: DoneSet) => {
        setControl.patchValue({
          completed: true,
          doneSetId: response.id
        });

        setControl.get('weightLifted')?.disable();
        setControl.get('actualVolume')?.disable();
        setControl.get('actualIntensity')?.disable();

        this.updateProgress();

        if (this.currentWorkout?.nextWorkoutDetails) {
          this.currentWorkout.nextWorkoutDetails.doneSets = [
            ...(this.currentWorkout.nextWorkoutDetails.doneSets ?? []),
            response
          ];
        }

        const isLastSetOfExercise = setIndex === setsArray.length - 1;
        const isLastExercise = exerciseIndex === this.exercises.length - 1;
        if (!isLastSetOfExercise || !isLastExercise) {
          this.startRestTimer(exerciseIndex);
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Workout Complete!',
            detail: 'All sets finished. Review summary and click Finish.',
            life: 4000
          });
        }
      },
      error: (error) => {
        const detail = error?.error?.message || 'Failed to save completed set.';
        this.messageService.add({ severity: 'error', summary: 'Save Error', detail: detail });
        console.error('Error completing set:', error);
      }
    });
  }

  uncompleteSet(exerciseIndex: number, setIndex: number): void {
    const exerciseControl = this.getExerciseControl(exerciseIndex);
    const setsArray = this.getExerciseSets(exerciseIndex);
    const setControl = setsArray?.at(setIndex);

    if (!exerciseControl || !setControl || !setsArray) {
      this.messageService.add({
        severity: 'error',
        summary: 'Internal Error',
        detail: 'Could not find set to undo.'
      });
      console.error(`Could not find control for uncomplete: ${exerciseIndex}, ${setIndex}`);
      return;
    }

    const doneSetId = setControl.get('doneSetId')?.value;
    const nextWorkoutDetailsId = this.currentWorkout?.nextWorkoutDetails?.id;

    if (!doneSetId || !nextWorkoutDetailsId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Undo Error',
        detail: 'Completed set record not found.'
      });
      console.error('Could not find doneSet ID for uncompleteSet:', {
        nextWorkoutDetailsId,
        doneSetId,
        setIndex
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Undo this completed set?',
      header: 'Undo Set Confirmation',
      icon: 'pi pi-undo',
      acceptLabel: 'Yes, Undo',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-warning',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.workoutService.uncompleteSet(nextWorkoutDetailsId, doneSetId).subscribe({
          next: (response) => {
            if (this.currentWorkout?.nextWorkoutDetails?.doneSets) {
              this.currentWorkout.nextWorkoutDetails.doneSets =
                this.currentWorkout.nextWorkoutDetails.doneSets.filter(ds => ds.id !== doneSetId);
            }

            setControl.patchValue({
              completed: false,
              doneSetId: null
            });

            setControl.get('weightLifted')?.enable();
            setControl.get('actualVolume')?.enable();
            setControl.get('actualIntensity')?.enable();

            this.updateProgress();

          },
          error: (error) => {
            const detail = error?.error?.message || 'Failed to undo set.';
            this.messageService.add({ severity: 'error', summary: 'Undo Failed', detail: detail });
            console.error('Error uncompleting set:', error);
          }
        });
      }
    });
  }

  // --- UPDATED: Add Set Method to use Backend API ---
  addSet(exerciseIndex: number): void {
    const exerciseControl = this.getExerciseControl(exerciseIndex);
    const setsArray = this.getExerciseSets(exerciseIndex);

    if (!exerciseControl || !setsArray) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not add new set.'
      });
      return;
    }

    // Get the last set to use as a template
    const lastSetIndex = setsArray.length - 1;
    if (lastSetIndex < 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No template set found to clone.'
      });
      return;
    }

    const lastSet = setsArray.at(lastSetIndex) as FormGroup;
    const volumeRange = lastSet.get('volumeRange')?.value;
    const intensityRange = lastSet.get('intensityRange')?.value;
    const volumeMetricId = lastSet.get('volumeMetric')?.value?.id;
    const intensityMetricId = lastSet.get('intensityMetric')?.value?.id;

    // Prepare data for backend
    const createSetDTO: CreateSetDTO = {
      volumeMin: volumeRange?.min,
      volumeMax: volumeRange?.max,
      volumeMetric: volumeMetricId,
      intensityMin: intensityRange?.min,
      intensityMax: intensityRange?.max,
      intensityMetric: intensityMetricId
    };

    const startedWorkoutId = this.currentWorkout?.nextWorkoutDetails?.id || 0;
    const workoutExerciseId = exerciseControl.get('id')?.value;

    if (!startedWorkoutId || !workoutExerciseId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Missing workout or exercise ID.'
      });
      return;
    }

    this.workoutService.addSet(startedWorkoutId, workoutExerciseId, createSetDTO).subscribe({
      next: (response) => {
        // Create a new FormGroup for the added set
        const newSetId = response.id;

        // Clone set from the last one, but with the new ID
        const newSetGroup = this.fb.group({
          id: [newSetId],
          volumeMetric: [lastSet.get('volumeMetric')?.value],
          intensityMetric: [lastSet.get('intensityMetric')?.value],
          volumeRange: [lastSet.get('volumeRange')?.value],
          intensityRange: [lastSet.get('intensityRange')?.value],
          completed: [false],
          actualVolume: [null],
          actualIntensity: [null],
          weightLifted: [null],
          isAdditionalSet: [true],
          doneSetId: [null]
        });

        // Add the new set to the FormArray
        setsArray.push(newSetGroup);

        // Update totals
        this.totalSets++;
        this.updateProgress();
      },
      error: (error) => {
        const detail = error?.error?.message || 'Failed to add new set.';
        this.messageService.add({
          severity: 'error',
          summary: 'Add Set Failed',
          detail: detail
        });
        console.error('Error adding set:', error);
      }
    });
  }

  // --- NEW: Change Exercise Method ---
  openChangeExerciseDialog(exerciseIndex: number): void {
    this.selectedExerciseIndex = exerciseIndex;
    const exerciseControl = this.getExerciseControl(exerciseIndex);

    if (exerciseControl) {
      this.selectedExerciseId = exerciseControl.get('exerciseId')?.value || null;

      // Load available exercises from the exercise service
      this.exerciseService.getExercisesOverview().subscribe({
        next: (exercises: ExerciseOverview[]) => {
          this.availableExercises = exercises;
          this.showExerciseChangeDialog = true;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load available exercises.'
          });
          console.error('Error loading exercises:', error);
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Could not find exercise data.'
      });
    }
  }

  changeExercise(): void {
    if (this.selectedExerciseIndex === null || !this.selectedExerciseId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select an exercise.'
      });
      return;
    }

    const exerciseControl = this.getExerciseControl(this.selectedExerciseIndex);
    if (!exerciseControl) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Exercise data not found.'
      });
      return;
    }

    const currentExerciseId = exerciseControl.get('exerciseId')?.value;
    if (currentExerciseId === this.selectedExerciseId) {
      this.showExerciseChangeDialog = false;
      return; // No change needed
    }

    const startedWorkoutId = this.currentWorkout?.nextWorkoutDetails?.id || 0;
    const workoutExerciseId = exerciseControl.get('id')?.value;

    if (!startedWorkoutId || !workoutExerciseId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Missing workout or exercise ID.'
      });
      return;
    }

    this.workoutService.changeExercise(
      startedWorkoutId,
      workoutExerciseId,
      this.selectedExerciseId
    ).subscribe({
      next: (response) => {
        // Find the selected exercise details
        const newExercise = this.availableExercises.find(e => e.id === this.selectedExerciseId);

        if (newExercise) {
          // Update the exercise in the form, including the video link
          exerciseControl.patchValue({
            exerciseId: newExercise.id,
            exerciseTitle: newExercise.title,
            exerciseLink: newExercise.link
          });

        }

        this.showExerciseChangeDialog = false;
      },
      error: (error) => {
        const detail = error?.error?.message || 'Failed to change exercise.';
        this.messageService.add({
          severity: 'error',
          summary: 'Change Failed',
          detail: detail
        });
        console.error('Error changing exercise:', error);
      }
    });
  }

  // --- NEW: Reorder Exercises Method ---
  openExerciseOrderDialog(): void {
    // Format the exercises for the dialog
    const exercises = this.exercises.controls.map(exerciseControl => {
      return {
        id: exerciseControl.get('id')?.value,
        title: exerciseControl.get('exerciseTitle')?.value,
        exerciseId: exerciseControl.get('exerciseId')?.value
      };
    });

    this.ref = this.dialogService.open(ExerciseOrderDialogComponent, {
      header: 'Reorder Exercises',
      data: {
        exercises: exercises
      },
      modal:true,
      position:this.showInputButtons?"center":"bottom",
      styleClass:"m-0 border-round-top-2xl border-noround-bottom md:border-round-top-2xl md:border-round-bottom-2xl w-full md:w-7"
    });

    this.ref.onClose.subscribe((result) => {
      if (result) {
        // Get the IDs in the new order
        const exerciseIds: number[] = result.map((exercise: { id: any; }) => exercise.id);
        const startedWorkoutId = this.currentWorkout?.nextWorkoutDetails?.id || 0;

        if (!startedWorkoutId || exerciseIds.length === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not update exercise order.'
          });
          return;
        }

        const changeOrderDTO: ChangeExerciseOrderDTO = {
          workoutExerciseIds: exerciseIds
        };

        this.workoutService.changeExerciseOrder(startedWorkoutId, changeOrderDTO).subscribe({
          next: (response) => {
            // Update the local form to match the new order
            this.reorderExercisesInForm(exerciseIds);

            this.messageService.add({
              severity: 'success',
              summary: 'Order Updated',
              detail: 'Exercise order updated successfully',
              life: 2000
            });
          },
          error: (error) => {
            const detail = error?.error?.message || 'Failed to update exercise order.';
            this.messageService.add({
              severity: 'error',
              summary: 'Update Failed',
              detail: detail
            });
            console.error('Error updating exercise order:', error);
          }
        });
      }
    });
  }

  // Helper method to reorder the exercises in the form
  reorderExercisesInForm(orderedIds: number[]): void {
    const currentControls = this.exercises.controls;
    const newControls = [];

    // Re-arrange the controls according to the new order
    for (const id of orderedIds) {
      const controlIndex = currentControls.findIndex(
        control => control.get('id')?.value === id
      );

      if (controlIndex !== -1) {
        newControls.push(currentControls[controlIndex]);
      }
    }

    // Clear and rebuild the form array
    while (this.exercises.length) {
      this.exercises.removeAt(0);
    }

    for (const control of newControls) {
      this.exercises.push(control);
    }
  }
  // --- Workout Completion ---

  openSummary(): void {
    this.updateProgress();
    this.showSummary = true;
  }
  submitWorkout(): void {
    this.updateProgress();

    const completedSetsCount = this.countCompletedSets();
    if (completedSetsCount === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Cannot Finish', detail: 'Complete at least one set first.', life: 3000 });
      return;
    }

    const totalSetsCount = this.totalSets;
    const hasIncompleteSets = completedSetsCount < totalSetsCount;
    const confirmMessage = hasIncompleteSets
      ? `Finish workout with ${completedSetsCount} of ${totalSetsCount} sets completed?`
      : 'All sets completed. Finish workout?';

    this.confirmationService.confirm({
      message: confirmMessage,
      header: 'Finish Workout Confirmation',
      icon: hasIncompleteSets ? 'pi pi-exclamation-triangle' : 'pi pi-check-circle',
      acceptLabel: 'Yes, Finish',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-primary',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => this.saveWorkout()
    });
  }

  saveWorkout(): void {
    if (!this.currentWorkout?.nextWorkoutDetails?.id) {
      this.messageService.add({ severity: 'error', summary: 'Save Error', detail: 'Workout details missing.' });
      console.error('Missing nextWorkoutDetails or ID for saveWorkout');
      return;
    }

    this.submitting = true;
    const nextWorkoutDetailsId = this.currentWorkout.nextWorkoutDetails.id;
    const programIdParam = this.route.snapshot.params['id'];
    const startedProgramId = programIdParam ? parseInt(programIdParam, 10) : 0;

    if (isNaN(startedProgramId) || startedProgramId <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Save Error', detail: 'Invalid Program ID.' });
      console.error('Invalid Program ID for saveWorkout:', programIdParam);
      this.submitting = false;
      return;
    }

    this.workoutService.completeWorkout(nextWorkoutDetailsId, startedProgramId).subscribe({
      next: (response) => {
        this.submitting = false;
        this.stopWorkoutTimer();
        this.messageService.add({
          severity: 'success',
          summary: 'Workout Finished!',
          detail: response?.message || 'Workout saved successfully.',
          life: 3000
        });
        this.router.navigate(['/dashboard'], { state: { workoutJustCompleted: true } });
      },
      error: (error) => {
        this.submitting = false;
        const detail = error?.error?.message || 'Failed to save workout.';
        this.messageService.add({ severity: 'error', summary: 'Save Failed', detail: detail });
        console.error('Error submitting workout:', error);
      }
    });
  }

  // --- Rest Timer Methods ---

  startRestTimer(exerciseIndex: number): void {
    this.stopRestTimer(); // Clear existing timer

    const exerciseControl = this.getExerciseControl(exerciseIndex);
    const restTime = exerciseControl?.get('restTime')?.value;
    const restDuration = (restTime?.max > 0) ? restTime.max : 60; // Default 60s

    this.restTimeRemaining = restDuration;
    this.showRestTimer = true;

    this.restTimer = setInterval(() => {
      this.restTimeRemaining--;
      if (this.restTimeRemaining <= 0) {
        this.stopRestTimer();
        this.messageService.add({ severity: 'info', summary: 'Rest Over', life: 1500 });
      }
    }, 1000);
  }

  stopRestTimer(): void {
    if (this.restTimer) {
      clearInterval(this.restTimer);
      this.restTimer = null;
    }
    this.showRestTimer = false;
    this.restTimeRemaining = 0;
  }

  skipRestTimer(): void {
    this.stopRestTimer();
  }

  // --- Workout Timer Methods ---

  startWorkoutTimer(): void {
    this.stopWorkoutTimer(); // Clear any existing timer first

    // Use the workout's start date if available, otherwise use current time
    if (this.currentWorkout?.nextWorkoutDetails?.startDate) {
      // Convert string date to timestamp if needed
      const startDateStr = this.currentWorkout.nextWorkoutDetails.startDate;
      const startDate = typeof startDateStr === 'string'
        ? new Date(startDateStr)
        : startDateStr;

      this.workoutStartTime = startDate.getTime();

      // Calculate initial duration based on elapsed time since workout started
      const now = Date.now();
      this.workoutDurationSeconds = Math.floor((now - this.workoutStartTime) / 1000);
    } else {
      // Fallback to current time if no start date available
      this.workoutStartTime = Date.now();
      this.workoutDurationSeconds = 0;
    }

    // Initial display update
    this.updateWorkoutDurationDisplay();

    // Start interval for ongoing updates
    this.workoutDurationInterval = setInterval(() => {
      if (this.workoutStartTime) {
        const now = Date.now();
        this.workoutDurationSeconds = Math.floor((now - this.workoutStartTime) / 1000);
        this.updateWorkoutDurationDisplay();
      } else {
        console.warn('Workout timer interval running without start time.');
        this.stopWorkoutTimer();
      }
    }, 1000);
  }

  stopWorkoutTimer(): void {
    if (this.workoutDurationInterval) {
      clearInterval(this.workoutDurationInterval);
      this.workoutDurationInterval = null;
    }
  }

  updateWorkoutDurationDisplay(): void {
    const totalSeconds = this.workoutDurationSeconds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    // Always include hours format for consistency with longer workouts
    this.workoutDurationDisplay = `${hoursStr}:${minutesStr}:${secondsStr}`;
  }

  // --- UI Helper Methods ---

  getPlaceholderText(
    range: { min: number | null, max: number | null } | null,
    metric: { id?: number, title?: string, metricSymbol?: string, range?: boolean } | null,
    defaultText: string
  ): string {
    // Use metric title first if available
    let placeholder = metric?.title || defaultText;

    // Early return if range is null or undefined
    if (!range) return placeholder;

    const hasMin = range.min !== null && range.min !== undefined;
    const hasMax = range.max !== null && range.max !== undefined;

    // Determine if it's a range - use metric.range property directly
    const isRange = metric?.range === true;

    if (isRange && hasMin && hasMax) {
      placeholder = `${range.min} - ${range.max}`;
    } else if (hasMax) {
      placeholder = `${range.max}`;
    } else if (hasMin) {
      placeholder = `min ${range.min}`;
    }

    // Add the metric symbol to make it clearer
   

    return placeholder;
  }

  getIntensityPlaceholder(setControl: AbstractControl | null): string {
    if (!setControl) return 'Intensity';
    const range = setControl.get('intensityRange')?.value;
    const metric = setControl.get('intensityMetric')?.value;
    return this.getPlaceholderText(range, metric, 'Intensity');
  }

  getVolumePlaceholder(setControl: AbstractControl | null): string {
    if (!setControl) return 'Volume';
    const range = setControl.get('volumeRange')?.value;
    const metric = setControl.get('volumeMetric')?.value;
    return this.getPlaceholderText(range, metric, 'Volume');
  }

  // --- Dialog Methods ---

  showHistoryDialog(exerciseIdControl: AbstractControl | null): void {
    const exerciseId = exerciseIdControl?.value;


    if (this.ref) { this.ref.close(); }

    this.ref = this.dialogService.open(ExerciseHistoryDialogComponent, {
      header: 'Exercise History',
      modal: true,
      closeOnEscape: true,
      closable: true,
      dismissableMask: true,
      data: { exerciseId: exerciseId },
      position:this.showInputButtons?"center":"bottom",
      styleClass:"m-0 border-round-top-2xl border-noround-bottom md:border-round-top-2xl md:border-round-bottom-2xl w-full md:w-7"
    });
  }

  showExerciseVideo(videoUrl: string | null): void {
    if (!videoUrl) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Video',
        detail: 'No demonstration video available for this exercise.'
      });
      return;
    }

    // Handle YouTube URLs
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      // Convert youtu.be URLs to embed format
      if (videoUrl.includes('youtu.be')) {
        const videoId = videoUrl.split('/').pop();
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      // Convert regular YouTube URLs to embed format
      else if (videoUrl.includes('watch?v=')) {
        const videoId = new URL(videoUrl).searchParams.get('v');
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      // For YouTube URLs already in embed format, use as is
    }

    this.currentVideoUrl = videoUrl;
    this.showVideoDialog = true;
  }
  
  getExerciseMenuItems(exerciseIndex: number, exerciseControl: AbstractControl | null): MenuItem[] {
    if (!exerciseControl) return [];

    return [
      {
        label: 'Watch Exercise Demo',
        icon: 'pi pi-video',
        command: () => this.showExerciseVideo(exerciseControl.get('exerciseLink')?.value),
        disabled: !exerciseControl.get('exerciseLink')?.value
      },
      {
        label: 'Reorder Exercises',
        icon: 'pi pi-sort',
        command: () => this.openExerciseOrderDialog()
      },
      {
        label: 'Change Exercise',
        icon: 'pi pi-sync',
        command: () => this.openChangeExerciseDialog(exerciseIndex)
      },
      {
        label: 'View History',
        icon: 'pi pi-chart-line',
        command: () => this.showHistoryDialog(exerciseControl.get('exerciseId'))
      }
    ];
  }

}