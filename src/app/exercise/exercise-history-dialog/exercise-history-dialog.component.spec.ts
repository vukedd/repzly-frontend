import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseHistoryDialogComponent } from './exercise-history-dialog.component';

describe('ExerciseHistoryDialogComponent', () => {
  let component: ExerciseHistoryDialogComponent;
  let fixture: ComponentFixture<ExerciseHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseHistoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
