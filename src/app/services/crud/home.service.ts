import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Home } from 'src/app/models/home';
import { FirestoreCrudService } from './firestore-crud.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends FirestoreCrudService<Home>{

    protected collectionPath = 'home';

  constructor(firestore: Firestore) {
    super(firestore);
    this.init();
  }
}
