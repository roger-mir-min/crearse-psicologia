import { Injectable } from '@angular/core';
import { Article } from '../../models/article';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreCrudService } from './firestore-crud.service';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService extends FirestoreCrudService<Article>{

    protected collectionPath = 'articles';

  constructor(firestore: Firestore) {
    super(firestore);
    this.init();
  }
  
}
