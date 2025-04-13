import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseOrderDialogComponent } from './exercise-order-dialog.component';

describe('ExerciseOrderDialogComponent', () => {
  let component: ExerciseOrderDialogComponent;
  let fixture: ComponentFixture<ExerciseOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseOrderDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
