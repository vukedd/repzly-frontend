import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyHighlighterComponent } from './body-highlighter.component';

describe('BodyHighlighterComponent', () => {
  let component: BodyHighlighterComponent;
  let fixture: ComponentFixture<BodyHighlighterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyHighlighterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
