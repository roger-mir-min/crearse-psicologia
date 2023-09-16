import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Women } from 'src/app/models/women';
import { FirestoreCrudService } from './firestore-crud.service';

@Injectable({
  providedIn: 'root'
})
export class WomenService extends FirestoreCrudService<Women>{

    protected collectionPath = 'women';

  constructor(firestore: Firestore) {
    super(firestore);
    this.init();
  }

}
