import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabList, TabsModule } from 'primeng/tabs';
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
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgramService } from '../program-service/program.service';
import { Program, Week, Workout, WorkoutExercise, WorkoutExerciseSet, Exercise, VolumeMetric, IntensityMetric } from '../program.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RatingModule } from 'primeng/rating';
import * as XLSX from 'xlsx';
import { TagModule } from 'primeng/tag';

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
    FileUploadModule,
    DialogModule,
    TagModule
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
  expandedWorkouts: Set<string> = new Set();
  @ViewChild('tablist') tablistComponent!: TabList;

  // Dialog properties
  displayDescriptionDialog: boolean = false;
  selectedWorkoutDescription: string = '';
  selectedWorkoutTitle: string = '';

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

          // Auto-expand the first workout in the first week for better UX
          if (this.program.weeks[0].workouts && this.program.weeks[0].workouts.length > 0) {
            const workoutId = this.program.weeks[0].workouts[0].id;
            if (workoutId !== undefined) { // Good practice, though maybe redundant if id is required on Workout type
              this.expandedWorkouts.add(String(workoutId)); // Convert number to string
            }
          }
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

  // New method to handle showing description in dialog
  showDescription(workout: Workout): void {
    this.selectedWorkoutTitle = workout.title || 'Workout Details';
    this.selectedWorkoutDescription = workout.description || 'No description available.';
    this.displayDescriptionDialog = true;
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
      this.router.navigate(['/update-program/', this.program.id]);
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

  toggleWorkoutDetails(workoutId: any): void {
    if (this.expandedWorkouts.has(workoutId)) {
      this.expandedWorkouts.delete(workoutId);
    } else {
      this.expandedWorkouts.add(workoutId);
    }
  }

  isWorkoutExpanded(workoutId: any): boolean {
    return this.expandedWorkouts.has(workoutId);
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

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Program Overview Sheet
    const programOverview = [{
      'Program Name': this.program.name,
      'Creator': this.program.creator?.username || 'Unknown',
      'Rating': this.program.rating || 'Not rated',
      'Weeks': this.program.weeks.length,
      'Total Workouts': this.getTotalWorkouts(),
      'Total Exercises': this.getTotalExercises(),
      'Total Sets': this.getTotalSets()
    }];

    const overviewSheet = XLSX.utils.json_to_sheet(programOverview);

    // Set column widths for overview sheet
    const overviewCols = [
      { wch: 15 }, // Program Name
      { wch: 15 }, // Creator
      { wch: 10 }, // Rating
      { wch: 10 }, // Weeks
      { wch: 15 }, // Total Workouts
      { wch: 15 }, // Total Exercises
      { wch: 12 }  // Total Sets
    ];

    overviewSheet['!cols'] = overviewCols;
    XLSX.utils.book_append_sheet(wb, overviewSheet, 'Program Overview');

    // Process each week
    this.program.weeks.forEach((week, weekIndex) => {
      // Use aoa (array of arrays) for more control over formatting
      const weekData = [];
      const merges = [];

      // Add sheet title
      weekData.push([`Week ${weekIndex + 1} Training Program`]);
      merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }); // Extended to include new columns

      // Add empty row for spacing
      weekData.push([]);

      week.workouts.forEach((workout, workoutIndex) => {
        // Add workout header
        const workoutRow = weekData.length;
        weekData.push([`${workout.title || 'Workout ' + (workoutIndex + 1)} (${`Workout ${workoutIndex + 1}`})`]);
        merges.push({ s: { r: workoutRow, c: 0 }, e: { r: workoutRow, c: 8 } }); // Extended to include new columns

        // Add workout description if available
        if (workout.description) {
          const descRow = weekData.length;
          weekData.push([`Description: ${workout.description}`]);
          merges.push({ s: { r: descRow, c: 0 }, e: { r: descRow, c: 8 } }); // Extended to include new columns
        }

        // Add exercise table headers
        weekData.push([
          'Exercise',
          'Rest Time (sec)',
          'Set #',
          'Volume',
          'Volume Unit',
          'Intensity',
          'Intensity Unit',
          'Weight',       // New column for tracking weight
          'Notes'         // New column for notes
        ]);

        // Add exercise data
        let currentExercise = '';
        let currentRest = '';

        workout.workoutExercises.forEach((exercise, exerciseIndex) => {
          currentExercise = exercise.exercise.title;
          currentRest = exercise.minimumRestTime > 0 ?
            `${exercise.minimumRestTime}-${exercise.maximumRestTime}` :
            `${exercise.maximumRestTime}`;

          // Track where exercise name starts for merging
          const exerciseStartRow = weekData.length;
          let lastSetRow = exerciseStartRow;

          // For each set in the exercise
          exercise.sets.forEach((set, setIndex) => {
            const volumeValue = this.isVolumeRange(set) ?
              `${set.volume.minimumVolume}-${set.volume.maximumVolume}` :
              `${set.volume.maximumVolume}`;

            const intensityValue = this.isIntensityRange(set) ?
              `${set.intensity.minimumIntensity}-${set.intensity.maximumIntensity}` :
              `${set.intensity.maximumIntensity}`;

            weekData.push([
              currentExercise,
              currentRest,
              setIndex + 1,
              volumeValue,
              set.volumeMetric.metricSymbol,
              intensityValue,
              set.intensityMetric.metricSymbol,
              '',           // Empty cell for user to track weight
              ''            // Empty cell for user to add notes
            ]);

            // Only show exercise name and rest time once
            if (setIndex < exercise.sets.length - 1) {
              currentExercise = '';
              currentRest = '';
            }

            lastSetRow = weekData.length - 1;
          });

          // If exercise has multiple sets, merge the exercise and rest cells
          if (exercise.sets.length > 1) {
            merges.push({
              s: { r: exerciseStartRow, c: 0 },
              e: { r: lastSetRow, c: 0 }
            });
            merges.push({
              s: { r: exerciseStartRow, c: 1 },
              e: { r: lastSetRow, c: 1 }
            });
          }

          // Add empty row between exercises for readability
          weekData.push([]);
        });

        // Add empty row between workouts
        weekData.push([]);
      });

      // Create the sheet from the array data
      const weekSheet = XLSX.utils.aoa_to_sheet(weekData);

      // Add the merges to the sheet
      weekSheet['!merges'] = merges;

      // Set column widths - adjusted to include new columns
      const weekCols = [
        { wch: 25 }, // Exercise
        { wch: 15 }, // Rest Time
        { wch: 7 },  // Set #
        { wch: 10 }, // Volume
        { wch: 12 }, // Volume Unit
        { wch: 10 }, // Intensity
        { wch: 12 }, // Intensity Unit
        { wch: 12 }, // Weight - new column
        { wch: 20 }  // Notes - new column
      ];
      weekSheet['!cols'] = weekCols;

      // Set row heights - make them a bit taller for readability
      const rowHeights:any ={};
      for (let i = 0; i < weekData.length; i++) {
        rowHeights[i] = { hpt: 22 }; // height in points
      }
      weekSheet['!rows'] = rowHeights;

      // Add styling for title and header rows
      // Title row
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

    // Add Reviews sheet if available
    if (this.program.reviews && this.program.reviews.length > 0) {
      const reviewsData = [
        ['User', 'Rating', 'Comment']  // Headers
      ];

      // Add review data
      this.program.reviews.forEach(review => {
        reviewsData.push([
          review.user?.name || 'Anonymous',
          review.rating,
          review.comment || ''
        ]);
      });

      const reviewsSheet = XLSX.utils.aoa_to_sheet(reviewsData);

      // Set column widths for reviews
      reviewsSheet['!cols'] = [
        { wch: 20 }, // User
        { wch: 10 }, // Rating
        { wch: 50 }  // Comment
      ];

      XLSX.utils.book_append_sheet(wb, reviewsSheet, 'Reviews');
    }

    // Generate Excel file with styling
    const excelOptions:any = {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    };

    const excelBuffer = XLSX.write(wb, excelOptions);

    // Save to file
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const fileName = `${this.program.name.replace(/\s+/g, '_')}_program.xlsx`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    window.URL.revokeObjectURL(url);

    this.messageService.add({
      severity: 'success',
      summary: 'Export Successful',
      detail: `Program exported as Excel file: ${fileName}`
    });
  }

  onTabChange(event: any): void {
    this.activeWeekTab = event.index.toString();
    this.scrollToActiveTab();
  }

  scrollToActiveTab(): void {
    if (this.tablistComponent) {
      const element = this.findSingle(this.tablistComponent.content.nativeElement,
        `[data-pc-name="tab"][data-p-active="true"]`);
      if (element?.scrollIntoView) {
        element.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  private findSingle(element: HTMLElement, selector: string): HTMLElement | null {
    if (!element) return null;
    return element.querySelector(selector);
  }

  deleteProgram(): void {
    // Implementation left as it was in the original code
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