import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Exercise, IntensityMetric, VolumeMetric } from '../program.model';
import { ProgramService } from '../program-service/program.service';
import { ExerciseService } from '../program-service/exercise-service.service';
import { MetricService } from '../program-service/metric-service.service';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { InputNumberModule } from 'primeng/inputnumber';
import { forkJoin } from 'rxjs';

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
    InputNumberModule
  ],
  templateUrl: './program-create.component.html',
  styleUrl: './program-create.component.css',
  providers: [MessageService]
})
export class ProgramCreateComponent implements OnInit {
  programForm: FormGroup;
  uploadedImage: File | null = null;
  currentUser: any;
  loading = false;
  activeWeekTab: string = '0';

  // Data for dropdowns
  exercises: Exercise[] = [];
  volumeMetrics: VolumeMetric[] = [];
  intensityMetrics: IntensityMetric[] = [];
  
  // Track selected metrics for each exercise
  selectedVolumeMetrics: Map<string, VolumeMetric> = new Map();
  selectedIntensityMetrics: Map<string, IntensityMetric> = new Map();

  constructor(
    private fb: FormBuilder,
    private programService: ProgramService,
    private exerciseService: ExerciseService,
    private metricService: MetricService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.programForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      weeks: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Create observables for all data loading
    const exercises$ = this.exerciseService.getExercises();
    const volumeMetrics$ = this.metricService.getVolumeMetrics();
    const intensityMetrics$ = this.metricService.getIntensityMetrics();
    
    // Use forkJoin to wait for all data to load
    forkJoin({
      // exercises: exercises$,
      volumeMetrics: volumeMetrics$,
      intensityMetrics: intensityMetrics$
    }).subscribe({
      next: (result) => {
        // this.exercises = result.exercises;
        this.volumeMetrics = result.volumeMetrics;
        this.intensityMetrics = result.intensityMetrics;
        
        // Only add the initial week after data is loaded
        this.addWeek();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load form data'
        });
        console.error('Error loading form data:', error);
      }
    });
  }

  get weeks(): FormArray {
    return this.programForm.get('weeks') as FormArray;
  }

  addWeek(): void {
    const weekForm = this.fb.group({
      workouts: this.fb.array([])
    });
    this.weeks.push(weekForm);
    
    // Add initial workout to the new week
    this.addWorkout(this.weeks.length - 1);
    this.activeWeekTab = (this.weeks.length - 1).toString();
  }

  removeWeek(weekIndex: number): void {
    this.weeks.removeAt(weekIndex);
    if (parseInt(this.activeWeekTab) === weekIndex) {
      const newIndex = Math.max(0, weekIndex - 1);
      this.activeWeekTab = newIndex.toString();
    } else if (parseInt(this.activeWeekTab) > weekIndex) {
      // Adjust active tab if we removed a week before the active one
      this.activeWeekTab = (parseInt(this.activeWeekTab) - 1).toString();
    }
  }

  getWorkouts(weekIndex: number): FormArray {
    return this.weeks.at(weekIndex).get('workouts') as FormArray;
  }

  addWorkout(weekIndex: number): void {
    const workoutForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      number: [''],
      workoutExercises: this.fb.array([])
    });
    this.getWorkouts(weekIndex).push(workoutForm);
    
    // Add initial exercise to the new workout
    this.addWorkoutExercise(weekIndex, this.getWorkouts(weekIndex).length - 1);
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
      workoutExerciseSets: this.fb.array([])
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
      .at(exerciseIndex).get('workoutExerciseSets') as FormArray;
  }

  // Create set with all possible form controls to avoid "Cannot find control" errors
  addSet(weekIndex: number, workoutIndex: number, exerciseIndex: number): void {
    // Always create a form with all possible fields to avoid "Cannot find control" errors
    const setForm = this.fb.group({
      // Add all possible controls regardless of current metric types
      volumeMin: [null, Validators.required],
      volumeMax: [null, Validators.required],
      intensityMin: [null, Validators.required],
      intensityMax: [null, Validators.required]
    });
    
    this.getSets(weekIndex, workoutIndex, exerciseIndex).push(setForm);
  }

  removeSet(weekIndex: number, workoutIndex: number, exerciseIndex: number, setIndex: number): void {
    this.getSets(weekIndex, workoutIndex, exerciseIndex).removeAt(setIndex);
  }

  // Handle volume metric change
  onVolumeMetricChange(weekIndex: number, workoutIndex: number, exerciseIndex: number, event: any): void {
    const selectedMetric = event.value;
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;
    
    if (selectedMetric) {
      this.selectedVolumeMetrics.set(key, selectedMetric);
    }
  }
  
  // Handle intensity metric change
  onIntensityMetricChange(weekIndex: number, workoutIndex: number, exerciseIndex: number, event: any): void {
    const selectedMetric = event.value;
    const key = `${weekIndex}-${workoutIndex}-${exerciseIndex}`;
    
    if (selectedMetric) {
      this.selectedIntensityMetrics.set(key, selectedMetric);
    }
  }
  
  // Helper methods to check if metrics are range type
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

  onImageUpload(event: any): void {
    if (event.files && event.files.length > 0) {
      this.uploadedImage = event.files[0];
    }
  }

  onSubmit(): void {
    if (this.programForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fix the errors in the form before submitting'
      });
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('program', JSON.stringify(this.programForm.value));
    
    if (this.uploadedImage) {
      formData.append('image', this.uploadedImage);
    }

    this.programService.createProgram(formData).subscribe({
      next: (result: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Program created successfully'
        });
        this.router.navigate(['/programs', result.id]);
      },
      error: (error: any) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while creating the program'
        });
        console.error('Error creating program:', error);
      }
    });
  }
}