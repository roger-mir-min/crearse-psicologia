import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AsyncPipe],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {

  formReg: FormGroup;
  errorMessageSubj = new BehaviorSubject<string|undefined>(undefined);
  errorMessage$ = this.errorMessageSubj.asObservable().pipe(tap(err=>{console.log(err)}));

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService, 
    private meta: Meta
  ) {
    this.formReg = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  get getEmail() {
    return this.formReg.get("email");
  }
  
  get getPassword() {
    return this.formReg.get("password");
  }

  ngOnInit() {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }
  onSubmit() {
    this.loaderService.showSpinner();
    this.authService.register(this.formReg.value).then(response => {
      this.loaderService.hideSpinner();
      console.log(response);
      this.errorMessageSubj.next(undefined);
      this.router.navigate(['admin/login']);
      })
      .catch(error => {
        this.loaderService.hideSpinner();
        this.errorMessageSubj.next(this.authService.handleAuthError(error));
      });
  }

  signupWithGoogle() {
    this.loaderService.showAndHideSpinner();
    this.authService.registerWithGoogle().then(response => {
      console.log(response);
      this.errorMessageSubj.next(undefined);
      this.authService.isLoggedInSubj.next(true);
      this.router.navigate(['admin/add-content']);
    })
      .catch(error => {
        this.errorMessageSubj.next(this.authService.handleAuthError(error));
      });
  }

  navigateToLogin() {
    this.router.navigate(['admin/login']);
  }

  ngOnDestroy() {
    this.meta.removeTag("name='robots'");
  }
  
}
