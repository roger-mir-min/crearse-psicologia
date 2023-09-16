/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EmSupportService } from './em-support.service';

describe('Service: EmSupport', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmSupportService]
    });
  });

  it('should ...', inject([EmSupportService], (service: EmSupportService) => {
    expect(service).toBeTruthy();
  }));
});
