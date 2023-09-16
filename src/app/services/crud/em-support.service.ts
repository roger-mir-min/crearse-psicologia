import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { EmSupport } from 'src/app/models/em-support';
import { FirestoreCrudService } from './firestore-crud.service';

@Injectable({
  providedIn: 'root'
})
export class EmSupportService extends FirestoreCrudService<EmSupport>{


  protected collectionPath = 'em-support';

  constructor(firestore: Firestore) {
    super(firestore);
    this.init();
  }

}
