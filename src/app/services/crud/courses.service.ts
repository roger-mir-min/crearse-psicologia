import { Injectable } from '@angular/core';
import { Course } from '../../models/course';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreCrudService } from './firestore-crud.service';

@Injectable({
  providedIn: 'root'
})
export class CoursesService extends FirestoreCrudService<Course> {

    protected collectionPath = 'courses';

  constructor(firestore: Firestore) {
    super(firestore);
    this.init();
  }
}