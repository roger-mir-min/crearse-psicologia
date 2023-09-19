import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigateToService {

  constructor(private router: Router) {
  }
  
  navigateToLogin() {
    this.router.navigate(['admin/login']);
  }

}
