/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirestoreCrudService } from './firestore-crud.service';

describe('Service: FirestoreCrud', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirestoreCrudService]
    });
  });

  it('should ...', inject([FirestoreCrudService], (service: FirestoreCrudService) => {
    expect(service).toBeTruthy();
  }));
});
