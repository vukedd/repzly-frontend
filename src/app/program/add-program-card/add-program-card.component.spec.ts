import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProgramCardComponent } from './add-program-card.component';

describe('AddProgramCardComponent', () => {
  let component: AddProgramCardComponent;
  let fixture: ComponentFixture<AddProgramCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProgramCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProgramCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
