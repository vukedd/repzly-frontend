import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Exercise, ExerciseOverview, IntensityMetric, Program, VolumeMetric } from '../program.model';
import { ProgramService } from '../program-service/program.service';
import { ExerciseService } from '../../exercise/exercise-service.service';
import { MetricService } from '../../exercise/metric-service.service';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TabsModule, TabList } from 'primeng/tabs'; // Import TabList
import { InputNumberModule } from 'primeng/inputnumber';
import { catchError, finalize, forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Ripple } from 'primeng/ripple';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SafePipe } from '../../workout/workout-tracker/safe-pipe';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { OrderListModule } from 'primeng/orderlist';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ToastsPositionService } from '../../layout/toasts/toasts-position.service';
import { AutoFocusModule } from 'primeng/autofocus';

@Component({
  selector: 'app-program-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    CommonModule,
    AccordionModule,
    DividerModule,
    SelectModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    TabsModule,
    InputNumberModule,
    ToastModule,
    StepperModule,
    BadgeModule,
    DialogModule,
    ProgressSpinnerModule,
    SafePipe,
    MenuModule,
    SelectButtonModule,
    TagModule,
    FieldsetModule,
    TooltipModule,
    OrderListModule,
    AvatarModule,
    CardModule,
    AutoFocusModule
  ],
  templateUrl: './program-create.component.html',
  styleUrl: './program-create.component.css',
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None
})
export class ProgramCreateComponent implements OnInit {
  programForm: FormGroup;
  uploadedImage: File | null = null;
  currentUser: any;
  loading = false;
  activeWeekTab: string = '0';
  selectedRestTime: Map<string, string> = new Map();
  restTimeMetrics: string[] = ['s', 'min'];
  activeStep: number = 1;
  imagePreviewUrl: string | null = null;
  editWorkoutDialogVisible = false;
  selectedWeekIndex: number | null = null;
  selectedWorkoutIndex: number | null = null;
  editWorkoutTitle = '';
  editWorkoutDescription = '';
  restTimeDialogVisible: boolean = false;
  selectedExerciseInfo: { weekIndex: number, workoutIndex: number, exerciseIndex: number } | null = null;
  editMinRestTime: number | null = null;
  editMaxRestTime: number | null = null;
  editRestTimeMetric: string | null = null;
  filteredExercisesMap = new Map<string, any[]>();

  // NEW PROPERTIES FOR EDIT MODE
  isEditMode: boolean = false;
  programId: number | null = null;
  existingImageUrl: string | null = null;
  imageChanged: boolean = false;

  // Add ViewChild for TabList
  @ViewChild('tablist') tablistComponent!: TabList;

  // Data for dropdowns
  exercises: ExerciseOverview[] = [];
  volumeMetrics: VolumeMetric[] = [];
  intensityMetrics: IntensityMetric[] = [];

  // Track selected metrics for each exercise
  selectedVolumeMetrics: Map<string, VolumeMetric> = new Map();
  selectedIntensityMetrics: Map<string, IntensityMetric> = new Map();

  copiedWorkout: any = null;
  copiedExercise: any = null;
  copiedWeek: any = null;

  showInputButtons = false;
  private destroy$ = new Subject<void>();

  showVideoDialog = false;
  currentVideoUrl: string | null = null;

  activeWorkoutAccordionIndices: Map<number, number | null> = new Map();



  publicOptions: any[];

  constructor(
    private fb: FormBuilder,
    private programService: ProgramService,
    private exerciseService: ExerciseService,
    private metricService: MetricService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    public toastsPositionService: ToastsPositionService
  ) {
    this.publicOptions = [
      { label: 'Private', value: false },
      { label: 'Public', value: true }
    ];
    this.programForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      public: [false],
      weeks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.showInputButtons = result.matches;
      });


    // Check if we're in edit mode by looking for an ID in the route parameters
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.programId = +id;
          return forkJoin({
            exercises: this.exerciseService.getExercisesOverview(),
            volumeMetrics: this.metricService.getVolumeMetrics(),
            intensityMetrics: this.metricService.getIntensityMetrics(),
            program: this.programService.getProgramById(this.programId),
            programImage: this.programService.getProgramImage(+id).pipe(
              catchError(() => of(null)) // Handle image fetch errors gracefully
            )
          });
        } else {
          return forkJoin({
            exercises: this.exerciseService.getExercisesOverview(),
            volumeMetrics: this.metricService.getVolumeMetrics(),
            intensityMetrics: this.metricService.getIntensityMetrics(),
            program: of(null),
            programImage: of(null)
          });
        }
      }),
      catchError(error => {
        console.error('Error loading data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load data'
        });
        // Return a default value to continue the observable chain
        return of({
          exercises: [],
          volumeMetrics: [],
          intensityMetrics: [],
          program: null,
          programImage: null
        });
      })
    ).subscribe({
      next: result => {
        this.exercises = result.exercises;
        this.volumeMetrics = result.volumeMetrics;
        this.intensityMetrics = result.intensityMetrics;

        if (this.isEditMode && result.program) {
          try {
            this.loadProgramData(result.program);

            // Handle the program image
            if (result.programImage && result.programImage.size > 0) {
              this.uploadedImage = result.programImage;
              const imageUrl = URL.createObjectURL(result.programImage);
              this.existingImageUrl = imageUrl;
              this.imagePreviewUrl = imageUrl;
            } else {
              // Make sure we clear image URLs if no valid image
              this.existingImageUrl = null;
              this.imagePreviewUrl = null;
            }
          } catch (err) {
            console.error('Error loading program data:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to parse program data'
            });
            // Add a default week in case of error
            this.addWeek();
          }
        } else {
          // Only add the initial week for new programs
          this.addWeek();
        }
        this.loading = false; // Set loading to false after processing the data
      },
      error: err => {
        console.error('Subscribe error handler:', err);
        this.loading = false; // Make sure loading is false on error
        this.addWeek(); // Make sure we have at least one week
      },
      complete: () => {
        this.loading = false; // Make sure loading is false on completion
      }
    });
  }

  loadProgramData(program: Program): void {
    // Set program name
    this.programForm.get('name')?.setValue(program.name);
    this.programForm.get('id')?.setValue(program.id);
    this.programForm.get('description')?.setValue(program.description);
    this.programForm.get('public')?.setValue(program.public);

    // Set image

    // Set image if available
    // if (program) {
    //   this.existingImageUrl = program.imageUrl;
    //   this.imagePreviewUrl = program.imageUrl;
    // }

    // Clear existing weeks array
    while (this.weeks.length) {
      this.weeks.removeAt(0);
    }

    // Load program structure (weeks, workouts, exercises)
    program.weeks.forEach((week, weekIndex) => {
      const weekForm = this.fb.group({
        id: [week.id],
        workouts: this.fb.array([])
      });
      this.weeks.push(weekForm);

      week.workouts.forEach(workout => {
        const workoutForm = this.fb.group({
          id: [workout.id],
          title: [workout.title || ''],
          description: [workout.description || ''],
          workoutExercises: this.fb.array([])
        });
        this.getWorkouts(weekIndex).push(workoutForm);

        workout.workoutExercises.forEach(exercise => {
          const exerciseForm = this.fb.group({
            id: [exercise.id],
            exercise: [this.findExerciseById(exercise.exercise.id ? exercise.exercise.id : 0), Validators.required],
            volumeMetric: [this.findVolumeMetricById(exercise.sets.length > 0 ? exercise.sets[0].volumeMetric.id : 0), Validators.required],
            intensityMetric: [this.findIntensityMetricById(exercise.sets.length > 0 ? exercise.sets[0].intensityMetric.id : 0), Validators.required],
            sets: this.fb.array([]),
            minimumRestTime: [exercise.minimumRestTime || 0, Validators.required],
            maximumRestTime: [exercise.maximumRestTime || 60, Validators.required],
            restTimeMetric: [this.restTimeMetrics[0], Validators.required]
          });

          this.getWorkoutExercises(weekIndex, this.getWorkouts(weekIndex).length - 1).push(exerciseForm);

          // Update the metrics maps
          const key = `${weekIndex}-${this.getWorkouts(weekIndex).length - 1}-${this.getWorkoutExercises(weekIndex, this.getWorkouts(weekIndex).length - 1).length - 1}`;

          this.selectedVolumeMetrics.set(key, exerciseForm.get('volumeMetric')?.value!);
          this.selectedIntensityMetrics.set(key, exerciseForm.get('intensityMetric')?.value!);

          // Load sets
          exercise.sets.forEach(set => {
            const setForm = this.fb.group({
              id: [set.id],
              volume: this.fb.group({
                minimumVolume: [set.volume.minimumVolume],
                maximumVolume: [set.volume.maximumVolume, Validators.required]
              }),
              intensity: this.fb.group({
                minimumIntensity: [set.intensity.minimumIntensity],
                maximumIntensity: [set.intensity.maximumIntensity, Validators.required]
              }),
              volumeMetric: [exerciseForm.get('volumeMetric')?.value],
              intensityMetric: [exerciseForm.get('intensityMetric')?.value]
            });

            this.getSets(
              weekIndex,
              this.getWorkouts(weekIndex).length - 1,
              this.getWorkoutExercises(weekIndex, this.getWorkouts(weekIndex).length - 1).length - 1
            ).push(setForm);
          });
        });
      });
    });

    // If no weeks were loaded, add a default one
    if (this.weeks.length === 0) {
      this.addWeek();
    }
  }

  findExerciseById(id: number): ExerciseOverview | null {
    return this.exercises.find(e => e.id === id) || null;
  }

  findVolumeMetricById(id: number): VolumeMetric | null {
    return this.volumeMetrics.find(m => m.id === id) || null;
  }

  findIntensityMetricById(id: number): IntensityMetric | null {
    return this.intensityMetrics.find(m => m.id === id) || null;
  }

  get weeks(): FormArray {
    return this.programForm.get('weeks') as FormArray;
  }

  private findSingle(element: HTMLElement, selector: string): HTMLElement | null {
    if (!element) return null;
    return element.querySelector(selector);
  }

  addWeek(): void {
    const weekForm = this.fb.group({
      workouts: this.fb.array([])
    });
    this.weeks.push(weekForm);

    // Add initial workout to the new week
    this.addWorkout(this.weeks.length - 1);

    // Set active week tab
    this.activeWeekTab = (this.weeks.length - 1).toString();

    // Schedule scrolling to the newly added tab
    setTimeout(() => this.scrollToActiveTab(), 100);
  }

  removeWeek(weekIndex: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.weeks.removeAt(weekIndex);
    if (parseInt(this.activeWeekTab) === weekIndex) {
      const newIndex = Math.max(0, weekIndex - 1);
      this.activeWeekTab = newIndex.toString();
    } else if (parseInt(this.activeWeekTab) > weekIndex) {
      // Adjust active tab if we removed a week before the active one
      this.activeWeekTab = (parseInt(this.activeWeekTab) - 1).toString();
    }

    // Update tab navigation after removing a tab
    setTimeout(() => {
      if (this.tablistComponent) {
        this.tablistComponent.updateButtonState();
        this.tablistComponent.updateInkBar();
        this.scrollToActiveTab();
      }
    }, 100);
  }

  // Method to scroll to the active tab
  scrollToActiveTab(): void {
    if (this.tablistComponent) {
      const element = this.findSingle(this.tablistComponent.content.nativeElement,
        `[data-pc-name="tab"][data-p-active="true"]`);
      if (element?.scrollIntoView) {
        element.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  // Method to handle tab changes
  onTabChange(event: any): void {
    this.activeWeekTab = event.index.toString();
    this.scrollToActiveTab();
  }

  getWorkouts(weekIndex: number): FormArray {
    return this.weeks.at(weekIndex).get('workouts') as FormArray;
  }

  addWorkout(weekIndex: number): void {
    const workoutForm = this.fb.group({
      title: [''],
      description: [''],
      workoutExercises: this.fb.array([])
    });
    const workoutsArray = this.getWorkouts(weekIndex);
    workoutsArray.push(workoutForm);
    const newWorkoutIndex = workoutsArray.length - 1;
    this.activeWorkoutAccordionIndices.set(weekIndex, newWorkoutIndex);

    this.addWorkoutExercise(weekIndex, newWorkoutIndex);
  }

  removeWorkout(weekIndex: number, workoutIndex: number): void {
    this.getWorkouts(weekIndex).removeAt(workoutIndex);
  }

  getWorkoutExercises(weekIndex: number, workoutIndex: number): FormArray {
    return this.getWorkouts(weekIndex).at(workoutIndex).get('workoutExercises') as FormArray;
  }

  addWorkoutExercise(weekIndex: number, workoutIndex: number): void {
    const exerciseForm = this.fb.group({
      exercise: [null, Validators.required],
      volumeMetric: [null, Validators.required],
      intensityMetric: [null, Validators.required],
      sets: this.fb.array([]),
      minimumRestTime: [0, Validators.required],
      maximumRestTime: [60, Validators.required],
      restTimeMetric: [this.restTimeMetrics[0], Validators.required]
    });

    this.getWorkoutExercises(weekIndex, workoutIndex).push(exerciseForm);

    // Get the index of the newly added exercise
    const exerciseIndex = this.getWorkoutExercises(weekIndex, workoutIndex).length - 1;
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;

    // Set default metrics if available
    const defaultVolumeMetric = this.volumeMetrics.length > 0 ? this.volumeMetrics[0] : null;
    const defaultIntensityMetric = this.intensityMetrics.length > 0 ? this.intensityMetrics[0] : null;

    // Update the form control values
    const exerciseControl = this.getWorkoutExercises(weekIndex, workoutIndex).at(exerciseIndex);
    if (defaultVolumeMetric) {
      exerciseControl.get('volumeMetric')?.setValue(defaultVolumeMetric);
      this.selectedVolumeMetrics.set(key, defaultVolumeMetric);
    }

    if (defaultIntensityMetric) {
      exerciseControl.get('intensityMetric')?.setValue(defaultIntensityMetric);
      this.selectedIntensityMetrics.set(key, defaultIntensityMetric);
    }

    // Add set after setting the metrics
    this.addSet(weekIndex, workoutIndex, exerciseIndex);
  }

  removeWorkoutExercise(weekIndex: number, workoutIndex: number, exerciseIndex: number): void {
    this.getWorkoutExercises(weekIndex, workoutIndex).removeAt(exerciseIndex);

    // Remove the metric selections from the maps
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;
    this.selectedVolumeMetrics.delete(key);
    this.selectedIntensityMetrics.delete(key);
  }

  getSets(weekIndex: number, workoutIndex: number, exerciseIndex: number): FormArray {
    return this.getWorkoutExercises(weekIndex, workoutIndex)
      .at(exerciseIndex).get('sets') as FormArray;
  }

  // Modify the addSet method in ProgramCreateComponent class
  addSet(weekIndex: number, workoutIndex: number, exerciseIndex: number): void {
    const setsArray = this.getSets(weekIndex, workoutIndex, exerciseIndex);
    const exerciseControl = this.getWorkoutExercises(weekIndex, workoutIndex).at(exerciseIndex);
    const currentVolumeMetric = exerciseControl.get('volumeMetric')?.value;
    const currentIntensityMetric = exerciseControl.get('intensityMetric')?.value;

    let newSetForm: FormGroup;

    if (setsArray.length > 0) {
      // Get the last set's values
      const lastSet = setsArray.at(setsArray.length - 1) as FormGroup;
      const lastSetValue = lastSet.getRawValue(); // Use getRawValue to include disabled controls

      // Create the new set by copying values from the last set
      // Ensure IDs are not copied if they exist, to treat it as a new entity
      newSetForm = this.fb.group({
        id: [null], // Explicitly set id to null for a new set
        volume: this.fb.group({
          minimumVolume: [lastSetValue.volume?.minimumVolume],
          maximumVolume: [lastSetValue.volume?.maximumVolume, Validators.required]
        }),
        intensity: this.fb.group({
          minimumIntensity: [lastSetValue.intensity?.minimumIntensity],
          maximumIntensity: [lastSetValue.intensity?.maximumIntensity, Validators.required]
        }),
        // Use the metrics from the last set, or fallback to the current exercise's metrics
        volumeMetric: [lastSetValue.volumeMetric || currentVolumeMetric],
        intensityMetric: [lastSetValue.intensityMetric || currentIntensityMetric]
      });
    } else {
      // If no existing sets, create a default new set with current exercise metrics
      newSetForm = this.fb.group({
        id: [null],
        volume: this.fb.group({
          minimumVolume: [null],
          maximumVolume: [null, Validators.required]
        }),
        intensity: this.fb.group({
          minimumIntensity: [null],
          maximumIntensity: [null, Validators.required]
        }),
        volumeMetric: [currentVolumeMetric],
        intensityMetric: [currentIntensityMetric]
      });
    }

    setsArray.push(newSetForm);
  }

  removeSet(weekIndex: number, workoutIndex: number, exerciseIndex: number, setIndex: number): void {
    this.getSets(weekIndex, workoutIndex, exerciseIndex).removeAt(setIndex);
  }

  onVolumeMetricChange(weekIndex: number, workoutIndex: number, exerciseIndex: number, event: any): void {
    const selectedMetric = event.value;
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;

    if (selectedMetric) {
      this.selectedVolumeMetrics.set(key, selectedMetric);

      // Update all existing sets with the new metric
      const sets = this.getSets(weekIndex, workoutIndex, exerciseIndex);
      for (let i = 0; i < sets.length; i++) {
        sets.at(i).get('volumeMetric')?.setValue(selectedMetric);
      }
    }
  }

  onIntensityMetricChange(weekIndex: number, workoutIndex: number, exerciseIndex: number, event: any): void {
    const selectedMetric = event.value;
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;

    if (selectedMetric) {
      this.selectedIntensityMetrics.set(key, selectedMetric);

      // Update all existing sets with the new metric
      const sets = this.getSets(weekIndex, workoutIndex, exerciseIndex);
      for (let i = 0; i < sets.length; i++) {
        sets.at(i).get('intensityMetric')?.setValue(selectedMetric);
      }
    }
  }

  isVolumeRange(weekIndex: number, workoutIndex: number, exerciseIndex: number): boolean {
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;
    const metric = this.selectedVolumeMetrics.get(key);
    return metric?.range || false;
  }

  isIntensityRange(weekIndex: number, workoutIndex: number, exerciseIndex: number): boolean {
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;
    const metric = this.selectedIntensityMetrics.get(key);
    return metric?.range || false;
  }

  onSubmit(): void {
    if (this.programForm.invalid) {
      this.programForm.markAllAsTouched(); // IMPORTANT: This triggers error display
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please correct the highlighted errors in the form before submitting.'
      });
      return;
    }

    this.loading = true;

    // Use the service to prepare the form data
    const formData = this.isEditMode ?
      this.programService.prepareFormDataUpdate(this.programForm.value, this.uploadedImage) :
      this.programService.prepareFormData(this.programForm.value, this.uploadedImage);


    // Determine whether to create or update
    const action = this.isEditMode
      ? this.programService.updateProgram(this.programId!, formData)
      : this.programService.createProgram(formData);

    action.subscribe({
      next: (result: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: this.isEditMode ? 'Program updated successfully' : 'Program created successfully'
        });
        this.router.navigate(['/programs', result.id]);
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.isEditMode ? 'An error occurred while updating the program' : 'An error occurred while creating the program'
        });
        console.error(this.isEditMode ? 'Error updating program:' : 'Error creating program:', error);
      }
    });
  }

  onRestTimeMetricChange(weekIndex: number, workoutIndex: number, exerciseIndex: number, event: any) {
    const selectedMetric = event.value;
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;
    const exerciseControl = this.getWorkoutExercises(weekIndex, workoutIndex).at(exerciseIndex);

    if (selectedMetric) {
      this.selectedRestTime.set(key, selectedMetric);

      // Get current values
      const currentMin = exerciseControl.get('minimumRestTime')?.value || 0;
      const currentMax = exerciseControl.get('maximumRestTime')?.value || 0;

      // If changing to 'min', multiply by 60 (converting from seconds)
      if (selectedMetric === 'min') {
        exerciseControl.get('minimumRestTime')?.setValue(Math.ceil(currentMin / 60));
        exerciseControl.get('maximumRestTime')?.setValue(Math.ceil(currentMax / 60));
      }
      // If changing from 'min' to 's', divide by 60 (converting to seconds)
      else {
        exerciseControl.get('minimumRestTime')?.setValue(currentMin * 60);
        exerciseControl.get('maximumRestTime')?.setValue(currentMax * 60);
      }
    }
  }

  getExerciseTitle(weekIndex: number, workoutIndex: number, exerciseIndex: number): string {
    const exercise = this.getWorkoutExercises(weekIndex, workoutIndex)
      .at(exerciseIndex).get('exercise')?.value;
    return exercise ? exercise.title : `Exercise ${exerciseIndex + 1}`;
  }

  createImagePreview(file: File): void {
    // Reset the preview URL if already exists
    if (this.imagePreviewUrl && this.imageChanged) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }

    // Create a new preview URL
    this.imagePreviewUrl = URL.createObjectURL(file);
    this.imageChanged = true;
  }

  removeImage(): void {
    // Clear the uploaded image
    this.uploadedImage = null;

    // Revoke and clear the preview URL
    if (this.imagePreviewUrl && this.imageChanged) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }

    this.imagePreviewUrl = null;
    this.existingImageUrl = null;
    this.imageChanged = true;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onImageUpload(event: any): void {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      if (file.size >= 256000) {
        return;
      }
      this.uploadedImage = event.files[0];
      if (this.uploadedImage) {
        this.createImagePreview(this.uploadedImage);
      }
    }
  }

  openWorkoutEditDialog(weekIndex: number, workoutIndex: number): void {
    this.selectedWeekIndex = weekIndex;
    this.selectedWorkoutIndex = workoutIndex;

    const workout = this.getWorkouts(weekIndex).at(workoutIndex);
    this.editWorkoutTitle = workout.get('title')?.value || '';
    this.editWorkoutDescription = workout.get('description')?.value || '';

    this.editWorkoutDialogVisible = true;
  }

  closeWorkoutEditDialog(): void {
    this.editWorkoutDialogVisible = false;
    this.selectedWeekIndex = null;
    this.selectedWorkoutIndex = null;
  }

  saveWorkoutChanges(): void {
    if (this.selectedWeekIndex !== null && this.selectedWorkoutIndex !== null) {
      const workout = this.getWorkouts(this.selectedWeekIndex).at(this.selectedWorkoutIndex);

      workout.patchValue({
        title: this.editWorkoutTitle,
        description: this.editWorkoutDescription
      });

      this.closeWorkoutEditDialog();
    }
  }

  openRestTimeDialog(weekIndex: number, workoutIndex: number, exerciseIndex: number): void {
    this.selectedExerciseInfo = { weekIndex, workoutIndex, exerciseIndex };

    // Get current values from the form
    const exercise = this.getWorkoutExercises(weekIndex, workoutIndex).at(exerciseIndex);
    this.editMinRestTime = exercise.get('minimumRestTime')?.value;
    this.editMaxRestTime = exercise.get('maximumRestTime')?.value;
    this.editRestTimeMetric = exercise.get('restTimeMetric')?.value;

    this.restTimeDialogVisible = true;
  }

  closeRestTimeDialog(): void {
    this.restTimeDialogVisible = false;
    this.selectedExerciseInfo = null;
  }

  saveRestTimeChanges(): void {
    if (this.selectedExerciseInfo) {
      const { weekIndex, workoutIndex, exerciseIndex } = this.selectedExerciseInfo;
      const exercise = this.getWorkoutExercises(weekIndex, workoutIndex).at(exerciseIndex);

      // Update form values
      exercise.patchValue({
        minimumRestTime: this.editMinRestTime,
        maximumRestTime: this.editMaxRestTime,
        restTimeMetric: this.editRestTimeMetric
      });

      // Call the onChange handler if needed (for unit conversion)
      if (exercise.get('restTimeMetric')?.value !== this.editRestTimeMetric) {
        this.onRestTimeMetricChange(weekIndex, workoutIndex, exerciseIndex, { value: this.editRestTimeMetric });
      }

      this.closeRestTimeDialog();
    }
  }

  // Clean up when component is destroyed
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.imagePreviewUrl && this.imageChanged) {
      URL.revokeObjectURL(this.imagePreviewUrl);
    }
  }

  // Helper method to get page title based on mode
  getPageTitle(): string {
    return this.isEditMode ? 'Edit Fitness Program' : 'Create New Fitness Program';
  }

  // Helper method to get submit button text based on mode
  getSubmitButtonText(): string {
    return this.isEditMode ? 'Update Program' : 'Create Program';
  }

  // Add these methods to your ProgramCreateComponent class

  // For moving workouts up/down within a week
  moveWorkoutUp(weekIndex: number, workoutIndex: number): void {
    if (workoutIndex > 0) {
      const workouts = this.getWorkouts(weekIndex);
      const temp = workouts.at(workoutIndex);
      workouts.removeAt(workoutIndex);
      workouts.insert(workoutIndex - 1, temp);
    }
  }

  moveWorkoutDown(weekIndex: number, workoutIndex: number): void {
    const workouts = this.getWorkouts(weekIndex);
    if (workoutIndex < workouts.length - 1) {
      const temp = workouts.at(workoutIndex);
      workouts.removeAt(workoutIndex);
      workouts.insert(workoutIndex + 1, temp);
    }
  }

  // For moving exercises up/down within a workout
  moveExerciseUp(weekIndex: number, workoutIndex: number, exerciseIndex: number): void {
    if (exerciseIndex > 0) {
      const exercises = this.getWorkoutExercises(weekIndex, workoutIndex);
      const temp = exercises.at(exerciseIndex);
      exercises.removeAt(exerciseIndex);
      exercises.insert(exerciseIndex - 1, temp);

      // Update the keys in our maps for the moved exercises
      this.updateExerciseMetricKeys(weekIndex, workoutIndex, exerciseIndex - 1, exerciseIndex);
    }
  }

  moveExerciseDown(weekIndex: number, workoutIndex: number, exerciseIndex: number): void {
    const exercises = this.getWorkoutExercises(weekIndex, workoutIndex);
    if (exerciseIndex < exercises.length - 1) {
      const temp = exercises.at(exerciseIndex);
      exercises.removeAt(exerciseIndex);
      exercises.insert(exerciseIndex + 1, temp);

      // Update the keys in our maps for the moved exercises
      this.updateExerciseMetricKeys(weekIndex, workoutIndex, exerciseIndex, exerciseIndex + 1);
    }
  }

  // Helper method to update the metric map keys when exercises change positions
  private updateExerciseMetricKeys(weekIndex: number, workoutIndex: number, fromIndex: number, toIndex: number): void {
    // Create temporary storage for the metric values
    const fromKey = `${weekIndex}-${workoutIndex}-${fromIndex}`;
    const toKey = `${weekIndex}-${workoutIndex}-${toIndex}`;

    // Store the values
    const volumeMetricFrom = this.selectedVolumeMetrics.get(fromKey);
    const volumeMetricTo = this.selectedVolumeMetrics.get(toKey);
    const intensityMetricFrom = this.selectedIntensityMetrics.get(fromKey);
    const intensityMetricTo = this.selectedIntensityMetrics.get(toKey);
    const restTimeFrom = this.selectedRestTime.get(fromKey);
    const restTimeTo = this.selectedRestTime.get(toKey);

    // Swap the values in the maps
    if (volumeMetricFrom) this.selectedVolumeMetrics.set(toKey, volumeMetricFrom);
    if (volumeMetricTo) this.selectedVolumeMetrics.set(fromKey, volumeMetricTo);

    if (intensityMetricFrom) this.selectedIntensityMetrics.set(toKey, intensityMetricFrom);
    if (intensityMetricTo) this.selectedIntensityMetrics.set(fromKey, intensityMetricTo);

    if (restTimeFrom) this.selectedRestTime.set(toKey, restTimeFrom);
    if (restTimeTo) this.selectedRestTime.set(fromKey, restTimeTo);
  }

  copyWeek(weekIndex: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    // Deep clone the week form group
    const weekToCopy = this.weeks.at(weekIndex);
    const weekValue = weekToCopy.getRawValue();
    // Remove any IDs for a proper copy
    this.removeIdsFromWeekData(weekValue);
    this.copiedWeek = weekValue;

    this.messageService.add({
      severity: 'success',
      summary: 'Week Copied',
      detail: `Week ${weekIndex + 1} has been copied to clipboard`
    });
  }

  pasteWeek(): void {
    if (!this.copiedWeek) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Nothing to Paste',
        detail: 'No week has been copied yet'
      });
      return;
    }

    // Create a new week with the copied data
    const weekForm = this.fb.group({
      workouts: this.fb.array([])
    });
    this.weeks.push(weekForm);

    // Populate the new week with workouts
    const newWeekIndex = this.weeks.length - 1;
    this.copiedWeek.workouts.forEach((workout: any) => {
      const workoutForm = this.fb.group({
        title: [workout.title || ''],
        description: [workout.description || ''],
        workoutExercises: this.fb.array([])
      });
      this.getWorkouts(newWeekIndex).push(workoutForm);

      const workoutIndex = this.getWorkouts(newWeekIndex).length - 1;

      // Add exercises to the workout
      workout.workoutExercises.forEach((exercise: any) => {
        const exerciseForm = this.fb.group({
          exercise: [this.findExerciseById(exercise.exercise?.id) || null, Validators.required],
          volumeMetric: [this.findVolumeMetricById(exercise.volumeMetric?.id) || null, Validators.required],
          intensityMetric: [this.findIntensityMetricById(exercise.intensityMetric?.id) || null, Validators.required],
          sets: this.fb.array([]),
          minimumRestTime: [exercise.minimumRestTime || 0, Validators.required],
          maximumRestTime: [exercise.maximumRestTime || 60, Validators.required],
          restTimeMetric: [exercise.restTimeMetric || this.restTimeMetrics[0], Validators.required]
        });

        this.getWorkoutExercises(newWeekIndex, workoutIndex).push(exerciseForm);
        const exerciseIndex = this.getWorkoutExercises(newWeekIndex, workoutIndex).length - 1;

        // Update metric maps
        const key = `${newWeekIndex}-${workoutIndex}-${exerciseIndex}`;
        const volumeMetricValue = exerciseForm.get('volumeMetric')?.value;
        if (volumeMetricValue) {
          this.selectedVolumeMetrics.set(key, volumeMetricValue);
        }
        const intensityMetricValue = exerciseForm.get('intensityMetric')?.value;
        if (intensityMetricValue) {
          this.selectedIntensityMetrics.set(key, intensityMetricValue);
        }
        this.selectedRestTime.set(key, exerciseForm.get('restTimeMetric')?.value);

        // Add sets to the exercise
        exercise.sets.forEach((set: any) => {
          const setForm = this.fb.group({
            volume: this.fb.group({
              minimumVolume: [set.volume.minimumVolume],
              maximumVolume: [set.volume.maximumVolume, Validators.required]
            }),
            intensity: this.fb.group({
              minimumIntensity: [set.intensity.minimumIntensity],
              maximumIntensity: [set.intensity.maximumIntensity, Validators.required]
            }),
            volumeMetric: [exerciseForm.get('volumeMetric')?.value],
            intensityMetric: [exerciseForm.get('intensityMetric')?.value]
          });

          this.getSets(newWeekIndex, workoutIndex, exerciseIndex).push(setForm);
        });
      });
    });

    // Set the active tab to the new week
    this.activeWeekTab = (this.weeks.length - 1).toString();
    setTimeout(() => this.scrollToActiveTab(), 100);

    this.messageService.add({
      severity: 'success',
      summary: 'Week Pasted',
      detail: 'Week has been pasted successfully'
    });
  }

  // Methods to copy/paste workouts
  copyWorkout(weekIndex: number, workoutIndex: number): void {
    // Deep clone the workout form group
    const workoutToCopy = this.getWorkouts(weekIndex).at(workoutIndex);
    const workoutValue = workoutToCopy.getRawValue();
    // Remove any IDs for a proper copy
    this.removeIdsFromWorkoutData(workoutValue);
    this.copiedWorkout = workoutValue;

    this.messageService.add({
      severity: 'success',
      summary: 'Workout Copied',
      detail: `Workout "${workoutValue.title}" has been copied to clipboard`
    });
  }

  pasteWorkout(weekIndex: number): void {
    if (!this.copiedWorkout) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Nothing to Paste',
        detail: 'No workout has been copied yet'
      });
      return;
    }

    const workoutForm = this.fb.group({
      title: [this.copiedWorkout.title || ''],
      description: [this.copiedWorkout.description || ''],
      workoutExercises: this.fb.array([])
    });
    const workoutsArray = this.getWorkouts(weekIndex);
    workoutsArray.push(workoutForm);
    const newWorkoutIndex = workoutsArray.length - 1;
    this.activeWorkoutAccordionIndices.set(weekIndex, newWorkoutIndex);

    this.copiedWorkout.workoutExercises.forEach((exercise: any) => {
      const exerciseForm = this.fb.group({
        exercise: [this.findExerciseById(exercise.exercise?.id) || null, Validators.required],
        volumeMetric: [this.findVolumeMetricById(exercise.volumeMetric?.id) || null, Validators.required],
        intensityMetric: [this.findIntensityMetricById(exercise.intensityMetric?.id) || null, Validators.required],
        sets: this.fb.array([]),
        minimumRestTime: [exercise.minimumRestTime || 0, Validators.required],
        maximumRestTime: [exercise.maximumRestTime || 60, Validators.required],
        restTimeMetric: [exercise.restTimeMetric || this.restTimeMetrics[0], Validators.required]
      });

      this.getWorkoutExercises(weekIndex, newWorkoutIndex).push(exerciseForm);
      const exerciseIndex = this.getWorkoutExercises(weekIndex, newWorkoutIndex).length - 1;

      const key = `${weekIndex}-${newWorkoutIndex}-${exerciseIndex}`;
      const volumeMetricValue = exerciseForm.get('volumeMetric')?.value;
      if (volumeMetricValue) {
        this.selectedVolumeMetrics.set(key, volumeMetricValue);
      }
      const intensityMetricValue = exerciseForm.get('intensityMetric')?.value;
      if (intensityMetricValue) {
        this.selectedIntensityMetrics.set(key, intensityMetricValue);
      }
      this.selectedRestTime.set(key, exerciseForm.get('restTimeMetric')?.value);

      exercise.sets.forEach((set: any) => {
        const setForm = this.fb.group({
          volume: this.fb.group({
            minimumVolume: [set.volume.minimumVolume],
            maximumVolume: [set.volume.maximumVolume, Validators.required]
          }),
          intensity: this.fb.group({
            minimumIntensity: [set.intensity.minimumIntensity],
            maximumIntensity: [set.intensity.maximumIntensity, Validators.required]
          }),
          volumeMetric: [exerciseForm.get('volumeMetric')?.value],
          intensityMetric: [exerciseForm.get('intensityMetric')?.value]
        });

        this.getSets(weekIndex, newWorkoutIndex, exerciseIndex).push(setForm);
      });
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Workout Pasted',
      detail: 'Workout has been pasted successfully'
    });
  }

  // Methods to copy/paste exercises
  copyExercise(weekIndex: number, workoutIndex: number, exerciseIndex: number): void {
    // Deep clone the exercise form group
    const exerciseToCopy = this.getWorkoutExercises(weekIndex, workoutIndex).at(exerciseIndex);
    const exerciseValue = exerciseToCopy.getRawValue();
    // Remove any IDs for a proper copy
    this.removeIdsFromExerciseData(exerciseValue);
    this.copiedExercise = exerciseValue;

    const exerciseName = exerciseValue.exercise?.title || `Exercise ${exerciseIndex + 1}`;
    this.messageService.add({
      severity: 'success',
      summary: 'Exercise Copied',
      detail: `${exerciseName} has been copied to clipboard`
    });
  }

  pasteExercise(weekIndex: number, workoutIndex: number): void {
    if (!this.copiedExercise) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Nothing to Paste',
        detail: 'No exercise has been copied yet'
      });
      return;
    }

    // Create a new exercise with the copied data
    const exerciseForm = this.fb.group({
      exercise: [this.findExerciseById(this.copiedExercise.exercise?.id) || null, Validators.required],
      volumeMetric: [this.findVolumeMetricById(this.copiedExercise.volumeMetric?.id) || null, Validators.required],
      intensityMetric: [this.findIntensityMetricById(this.copiedExercise.intensityMetric?.id) || null, Validators.required],
      sets: this.fb.array([]),
      minimumRestTime: [this.copiedExercise.minimumRestTime || 0, Validators.required],
      maximumRestTime: [this.copiedExercise.maximumRestTime || 60, Validators.required],
      restTimeMetric: [this.copiedExercise.restTimeMetric || this.restTimeMetrics[0], Validators.required]
    });

    this.getWorkoutExercises(weekIndex, workoutIndex).push(exerciseForm);
    const exerciseIndex = this.getWorkoutExercises(weekIndex, workoutIndex).length - 1;

    // Update metric maps
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;
    const volumeMetricValue = exerciseForm.get('volumeMetric')?.value;
    if (volumeMetricValue) {
      this.selectedVolumeMetrics.set(key, volumeMetricValue);
    }
    const intensityMetricValue = exerciseForm.get('intensityMetric')?.value;
    if (intensityMetricValue) {
      this.selectedIntensityMetrics.set(key, intensityMetricValue);
    }
    this.selectedRestTime.set(key, exerciseForm.get('restTimeMetric')?.value);

    // Add sets to the exercise
    this.copiedExercise.sets.forEach((set: any) => {
      const setForm = this.fb.group({
        volume: this.fb.group({
          minimumVolume: [set.volume.minimumVolume],
          maximumVolume: [set.volume.maximumVolume, Validators.required]
        }),
        intensity: this.fb.group({
          minimumIntensity: [set.intensity.minimumIntensity],
          maximumIntensity: [set.intensity.maximumIntensity, Validators.required]
        }),
        volumeMetric: [exerciseForm.get('volumeMetric')?.value],
        intensityMetric: [exerciseForm.get('intensityMetric')?.value]
      });

      this.getSets(weekIndex, workoutIndex, exerciseIndex).push(setForm);
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Exercise Pasted',
      detail: 'Exercise has been pasted successfully'
    });
  }

  // Helper methods to remove IDs from objects (to ensure they're treated as new)
  private removeIdsFromWeekData(weekData: any): void {
    delete weekData.id;

    if (weekData.workouts) {
      weekData.workouts.forEach((workout: any) => {
        this.removeIdsFromWorkoutData(workout);
      });
    }
  }

  private removeIdsFromWorkoutData(workoutData: any): void {
    delete workoutData.id;

    if (workoutData.workoutExercises) {
      workoutData.workoutExercises.forEach((exercise: any) => {
        this.removeIdsFromExerciseData(exercise);
      });
    }
  }

  private removeIdsFromExerciseData(exerciseData: any): void {
    delete exerciseData.id;

    if (exerciseData.sets) {
      exerciseData.sets.forEach((set: any) => {
        delete set.id;
      });
    }
  }

  showExerciseVideo(exercise: any, event?: Event): void {
    // Prevent the event from propagating up and potentially submitting the form
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    let videoUrl = exercise.get('exercise')?.value.link;
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

  getExerciseMenuItems(formIndex: number, workoutIndex: number, exerciseIndex: number): MenuItem[] {
    const exercise = this.getExerciseControl(formIndex, workoutIndex, exerciseIndex);
    if (!exercise) return [];

    return [
      {
        label: 'Watch Exercise Demo',
        icon: 'pi pi-video',
        command: () => this.showExerciseVideo(exercise),
        disabled: !exercise.get('exercise')?.value
      },
      {
        label: 'Copy Exercise',
        icon: 'pi pi-copy',
        command: () => this.copyExercise(formIndex, workoutIndex, exerciseIndex)
      },
      {
        label: 'Set Rest Time',
        icon: 'pi pi-clock',
        command: () => this.openRestTimeDialog(formIndex, workoutIndex, exerciseIndex)
      },
      {
        label: 'Move Up',
        icon: 'pi pi-arrow-up',
        command: () => this.moveExerciseUp(formIndex, workoutIndex, exerciseIndex),
        disabled: exerciseIndex === 0
      },
      {
        label: 'Move Down',
        icon: 'pi pi-arrow-down',
        command: () => this.moveExerciseDown(formIndex, workoutIndex, exerciseIndex),
        disabled: exerciseIndex === this.getWorkoutExercises(formIndex, workoutIndex).length - 1
      },
      {
        label: 'Remove Exercise',
        icon: 'pi pi-times',
        command: () => this.removeWorkoutExercise(formIndex, workoutIndex, exerciseIndex),
        disabled: this.getWorkoutExercises(formIndex, workoutIndex).length <= 1
      }
    ];
  }

  getWorkoutMenuItems(formIndex: number, workoutIndex: number): MenuItem[] {
    return [
      {
        label: 'Copy Workout',
        icon: 'pi pi-copy',
        command: () => this.copyWorkout(formIndex, workoutIndex)
      },
      {
        label: 'Move Up',
        icon: 'pi pi-arrow-up',
        command: () => this.moveWorkoutUp(formIndex, workoutIndex),
        disabled: workoutIndex === 0
      },
      {
        label: 'Move Down',
        icon: 'pi pi-arrow-down',
        command: () => this.moveWorkoutDown(formIndex, workoutIndex),
        disabled: workoutIndex === this.getWorkouts(formIndex).length - 1
      },
      {
        label: 'Remove Workout',
        icon: 'pi pi-times',
        command: () => this.removeWorkout(formIndex, workoutIndex),
        disabled: this.getWorkouts(formIndex).length <= 1
      }
    ];
  }

  getExerciseControl(formIndex: number, workoutIndex: number, exerciseIndex: number): AbstractControl | null {
    const exercises = this.getWorkoutExercises(formIndex, workoutIndex);
    return exercises && exercises.length > exerciseIndex ? exercises.at(exerciseIndex) : null;
  }

  preventEnterKeySubmission(event: Event) {
    const target = event.target as HTMLElement;

    if (target.nodeName === 'TEXTAREA') {
      return;
    }
    if (
      target.nodeName === 'BUTTON' ||
      (target.nodeName === 'INPUT' &&
        ['submit', 'button', 'reset'].includes((target as HTMLInputElement).type.toLowerCase()))
    ) {
      return;
    }
    event.preventDefault();
  }

  getActiveWorkoutAccordionIndex(weekIndex: number): number {
    return this.activeWorkoutAccordionIndices.get(weekIndex) ?? 0;
  }

  // --- NEW HELPER FUNCTIONS FOR VALIDATION MESSAGES ---
  getErrorMessage(control: AbstractControl | null, controlName: string): string {
    if (!control) return '';

    if (!control.errors || (!control.touched && !control.dirty)) {
      return '';
    }

    if (control.hasError('required')) {
      return `${controlName} is required.`;
    }
    if (control.hasError('minlength')) {
      const { requiredLength, actualLength } = control.errors['minlength'];
      return `${controlName} must be at least ${requiredLength} characters (current: ${actualLength}).`;
    }
    if (control.hasError('min')) {
      const { min, actual } = control.errors['min'];
      return `${controlName} must be at least ${min} (current: ${actual}).`;
    }
    if (control.hasError('max')) {
      const { max, actual } = control.errors['max'];
      return `${controlName} cannot exceed ${max} (current: ${actual}).`;
    }
    // Add more specific error checks here if needed (e.g., pattern, custom validators)
    return `Invalid value for ${controlName}.`; // Generic fallback
  }

  getNestedErrorMessage(
    control: AbstractControl | null,
    baseName: string,
    weekIndex?: number,
    workoutIndex?: number,
    exerciseIndex?: number
    // setIndex?: number // Not used for current set error message style, but kept for flexibility
  ): string {
    if (!control) return '';

    if (!control.errors || (!control.touched && !control.dirty)) {
      return '';
    }

    let context = '';
    let fieldName = baseName;

    if (weekIndex !== undefined && workoutIndex !== undefined && exerciseIndex !== undefined) {
      const exerciseCtrl = this.getWorkoutExercises(weekIndex, workoutIndex)?.at(exerciseIndex);
      const exerciseName = exerciseCtrl?.get('exercise')?.value?.title || `Exercise ${exerciseIndex + 1}`;
      context = `for ${exerciseName} (Week ${weekIndex + 1}, Workout ${workoutIndex + 1})`;
    }
    // If you wanted to include set index in the message, you'd add logic here.
    // For current implementation, set errors use the simpler `getErrorMessage`.

    if (control.hasError('required')) {
      return `${fieldName} is required ${context}.`;
    }
    if (control.hasError('minlength')) {
      const { requiredLength, actualLength } = control.errors['minlength'];
      return `${fieldName} must be at least ${requiredLength} characters ${context} (current: ${actualLength}).`;
    }
    if (control.hasError('min')) {
      const { min, actual } = control.errors['min'];
      return `${fieldName} must be at least ${min} ${context} (current: ${actual}).`;
    }
    // Add more as needed
    return `Invalid ${fieldName} ${context}.`;
  }
  handleNextFromStep1(activateCallback: (step: number) => void): void {
    const nameControl = this.programForm.get('name');
    // If you add more required top-level fields for step 1, check them here.
    // e.g., const descriptionControl = this.programForm.get('description');

    let step1IsValid = true;

    if (nameControl?.invalid) {
      nameControl.markAsTouched(); // Show error for name
      step1IsValid = false;
    }
    // if (descriptionControl?.invalid) { // Example for another field
    //   descriptionControl.markAsTouched();
    //   step1IsValid = false;
    // }

    if (step1IsValid) {
      activateCallback(2); // Proceed to step 2
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please complete the Program Information (Program Name) before proceeding.',
        life: 3000
      });
    }
  }

  handleNextFromStep2(activateCallback: (step: number) => void): void {
    const weeksArray = this.programForm.get('weeks') as FormArray;

    // Check if the 'weeks' FormArray and all its children are valid
    if (weeksArray.valid) {
      activateCallback(3); // Proceed to step 3
    } else {
      weeksArray.markAllAsTouched(); // Mark all controls within weeks as touched to display errors
      this.messageService.add({
        severity: 'warn',
        summary: 'Incomplete Workout Structure',
        detail: 'Please ensure all required fields in the workout structure are filled correctly. Check for missing exercises, metrics, or set values in all weeks and workouts.',
        life: 5000 // Longer duration for more complex errors
      });
      // Optionally, you could try to scroll to the first error, but this can be complex.
      // For now, the message and highlighting individual fields should guide the user.
    }
  }

  getExerciseKey(weekIndex: number, workoutIndex: number, exerciseIndex: number): string {
    return `${weekIndex}-${workoutIndex}-${exerciseIndex}`;
  }

  getFilteredExercises(weekIndex: number, workoutIndex: number, exerciseIndex: number): any[] {
    const key = this.getExerciseKey(weekIndex, workoutIndex, exerciseIndex);
    return this.filteredExercisesMap.get(key) || this.exercises;
  }

  onFilterChange(query: string, weekIndex: number, workoutIndex: number, exerciseIndex: number) {
    const key = this.getExerciseKey(weekIndex, workoutIndex, exerciseIndex);

    if (!query.trim()) {
      this.filteredExercisesMap.set(key, [...this.exercises]);
      return;
    }

    const queryWords = query.toLowerCase().split(/\s+/);
    const filtered = this.exercises.filter(exercise => {
      const title = exercise.title.toLowerCase();
      return queryWords.every((word: string) => title.includes(word));
    });

    this.filteredExercisesMap.set(key, filtered);
  }

  resetFilteredExercises() {
    this.filteredExercisesMap.clear();
  }



}