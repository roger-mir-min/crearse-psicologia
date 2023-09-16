/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WomenService } from './women.service';

describe('Service: Women', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WomenService]
    });
  });

  it('should ...', inject([WomenService], (service: WomenService) => {
    expect(service).toBeTruthy();
  }));
});
