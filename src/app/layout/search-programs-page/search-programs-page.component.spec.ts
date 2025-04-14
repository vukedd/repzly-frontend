import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchProgramsPageComponent } from './search-programs-page.component';

describe('SearchProgramsPageComponent', () => {
  let component: SearchProgramsPageComponent;
  let fixture: ComponentFixture<SearchProgramsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchProgramsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchProgramsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
