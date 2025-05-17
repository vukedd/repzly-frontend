import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedBannerComponent } from './animated-banner.component';

describe('AnimatedBannerComponent', () => {
  let component: AnimatedBannerComponent;
  let fixture: ComponentFixture<AnimatedBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
