import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProgramsPageComponent } from './my-programs-page.component';

describe('MyProgramsPageComponent', () => {
  let component: MyProgramsPageComponent;
  let fixture: ComponentFixture<MyProgramsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProgramsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProgramsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
