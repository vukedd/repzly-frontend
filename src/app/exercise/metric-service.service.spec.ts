import { TestBed } from '@angular/core/testing';

import { MetricService } from './metric-service.service';

describe('MetricServiceService', () => {
  let service: MetricService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
