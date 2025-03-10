import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartedProgramsPageComponent } from './started-programs-page.component';

describe('StartedProgramsPageComponent', () => {
  let component: StartedProgramsPageComponent;
  let fixture: ComponentFixture<StartedProgramsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartedProgramsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartedProgramsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
