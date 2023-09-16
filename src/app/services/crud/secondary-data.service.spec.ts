/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SecondaryDataService } from './secondary-data.service';

describe('Service: SecondaryData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecondaryDataService]
    });
  });

  it('should ...', inject([SecondaryDataService], (service: SecondaryDataService) => {
    expect(service).toBeTruthy();
  }));
});
