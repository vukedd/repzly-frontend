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
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgramService } from '../program-service/program.service';
import { Program, Week, Workout, WorkoutExercise, WorkoutExerciseSet, Exercise, VolumeMetric, IntensityMetric } from '../program.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-program-details',
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
    TextareaModule,
    InputNumberModule,
    SelectModule,
    FileUploadModule
  ],
  templateUrl: './program-details.component.html',
  styleUrl: './program-details.component.css',
  providers: [MessageService, ConfirmationService]
})
export class ProgramDetailsComponent implements OnInit {
  programId: string | null = null;
  program: Program | null = null;
  loading = true;
  imageUrl: SafeUrl = "";
  apiUrl: string;
  activeWeekTab: string = '0';
  expandedExercises: Set<string> = new Set();
  
  // Data for exercise information
  volumeMetrics: VolumeMetric[] = [];
  intensityMetrics: IntensityMetric[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private programService: ProgramService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.apiUrl = programService.apiUrl;
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.programId = params.get('id');
      if (this.programId) {
        this.loadProgram(this.programId);
      } else {
        this.loading = false;
      }
    });
  }
  
  loadProgram(id: string): void {
    this.loading = true;
    this.programService.getProgramById(parseInt(id)).subscribe({
      next: (data) => {
        this.program = data;
        this.loading = false;
        
        if (this.program.weeks && this.program.weeks.length > 0) {
          this.activeWeekTab = '0';
        }
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load program details'
        });
        console.error('Error loading program:', error);
      }
    });
  }
  
  
  getTotalWorkouts(): number {
    if (!this.program || !this.program.weeks) {
      return 0;
    }
    
    return this.program.weeks.reduce((total, week) => {
      return total + (week.workouts?.length || 0);
    }, 0);
  }
  
  getTotalExercises(): number {
    if (!this.program?.weeks) return 0;
    return this.program.weeks.reduce((weekTotal: number, week: any) => {
      if (!week.workouts) return weekTotal;
      return weekTotal + week.workouts.reduce((workoutTotal: number, workout: any) => {
        return workoutTotal + (workout.workoutExercises?.length || 0);
      }, 0);
    }, 0);
  }
  
  getTotalSets(): number {
    if (!this.program?.weeks) return 0;
    
    return this.program.weeks.reduce((weekTotal: number, week: any) => {
      if (!week.workouts) return weekTotal;
      
      return weekTotal + week.workouts.reduce((workoutTotal: number, workout: any) => {
        if (!workout.workoutExercises) return workoutTotal;
        
        return workoutTotal + workout.workoutExercises.reduce((exerciseTotal: number, exercise: any) => {
          return exerciseTotal + (exercise.sets?.length || 0);
        }, 0);
      }, 0);
    }, 0);
  }

  editProgram(): void {
    if (this.program) {
      this.router.navigate(['/programs/edit', this.program.id]);
    }
  }
  
  confirmDelete(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete this program?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProgram();
      }
    });
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
  
  isVolumeRange(set: WorkoutExerciseSet): boolean {
    return set.volumeMetric?.range || false;
  }
  
  isIntensityRange(set: WorkoutExerciseSet): boolean {
    return set.intensityMetric?.range || false;
  }

  printProgram(): void {
    window.print();
  }
  
  exportProgramData(): void {
    if (!this.program) return;
    
    const dataStr = JSON.stringify(this.program, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${this.program.name.replace(/\s+/g, '_')}_program.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  deleteProgram(): void {
    // if (!this.program) return;
    
    // this.loading = true;
    // this.programService.deleteProgram(this.program.id).subscribe({
    //   next: () => {
    //     this.loading = false;
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success',
    //       detail: 'Program deleted successfully'
    //     });
    //     this.router.navigate(['/programs']);
    //   },
    //   error: (error) => {
    //     this.loading = false;
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Failed to delete program'
    //     });
    //     console.error('Error deleting program:', error);
    //   }
    // });
  }
}