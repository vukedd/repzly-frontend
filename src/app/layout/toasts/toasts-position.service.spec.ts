import { TestBed } from '@angular/core/testing';

import { ToastsPositionService } from './toasts-position.service';

describe('ToastsPositionService', () => {
  let service: ToastsPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastsPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
