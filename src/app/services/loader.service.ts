import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  
  constructor() { }

  isLoadingSubj = new BehaviorSubject(false);
  isLoading$ = this.isLoadingSubj.asObservable();
  
  showSpinner() {
    this.isLoadingSubj.next(true);
  }

  hideSpinner() {
    this.isLoadingSubj.next(false);
  }

  showAndHideSpinner() {
    this.isLoadingSubj.next(true);
    setTimeout(() => { this.isLoadingSubj.next(false) }, 1500);
  }
  


}
