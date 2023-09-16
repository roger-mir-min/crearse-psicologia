/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CrudAbstractService } from './crud-abstract.service';

describe('Service: CrudAbstract', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrudAbstractService]
    });
  });

  it('should ...', inject([CrudAbstractService], (service: CrudAbstractService) => {
    expect(service).toBeTruthy();
  }));
});
