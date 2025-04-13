import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';  // Use this instead of primeng/dragdrop

@Component({
  selector: 'app-exercise-order-dialog',
  imports: [CommonModule, DragDropModule, ButtonModule, DialogModule],
  templateUrl: './exercise-order-dialog.component.html',
  styleUrl: './exercise-order-dialog.component.css'
})
export class ExerciseOrderDialogComponent implements OnInit {
  exercises: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    // Get exercises from the config
    if (this.config.data?.exercises) {
      this.exercises = [...this.config.data.exercises];
    }
  }

  drop(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.exercises, event.previousIndex, event.currentIndex);
  }

  applyOrder(): void {
    this.ref.close(this.exercises);
  }

  cancel(): void {
    this.ref.close();
  }
}