import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramListHorizontalComponent } from './program-list-horizontal.component';

describe('ProgramListHorizontalComponent', () => {
  let component: ProgramListHorizontalComponent;
  let fixture: ComponentFixture<ProgramListHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramListHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramListHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
