import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreCrudService } from './firestore-crud.service';
import { Secondary } from 'src/app/models/secondary';

@Injectable({
  providedIn: 'root'
})
export class SecondaryDataService extends FirestoreCrudService<Secondary>{

    protected collectionPath = 'secondary';

  constructor(firestore: Firestore) {
    super(firestore);
    this.init();
  }
}
