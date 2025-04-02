import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProgramsPageComponent } from './home-programs-page.component';

describe('HomeProgramsPageComponent', () => {
  let component: HomeProgramsPageComponent;
  let fixture: ComponentFixture<HomeProgramsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProgramsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProgramsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
