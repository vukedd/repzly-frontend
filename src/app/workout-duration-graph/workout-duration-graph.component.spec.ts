import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutDurationGraphComponent } from './workout-duration-graph.component';

describe('WorkoutDurationGraphComponent', () => {
  let component: WorkoutDurationGraphComponent;
  let fixture: ComponentFixture<WorkoutDurationGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutDurationGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutDurationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
