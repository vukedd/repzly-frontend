import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleTrackerComponent } from './muscle-tracker.component';

describe('MuscleTrackerComponent', () => {
  let component: MuscleTrackerComponent;
  let fixture: ComponentFixture<MuscleTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuscleTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
