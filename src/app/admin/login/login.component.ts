import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoaderService } from 'src/app/services/loader.service';
import { BehaviorSubject, tap } from 'rxjs';
import { Meta } from '@angular/platform-browser';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  formLogin: FormGroup;
  errorMessageSubj = new BehaviorSubject<string|undefined>(undefined);
  errorMessage$ = this.errorMessageSubj.asObservable().pipe(tap(err=>{console.log(err)}));

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService, 
    private meta: Meta
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  get getEmail() {
  return this.formLogin.get("email");
}
  
  get getPassword() {
    return this.formLogin.get("password");
  }


  ngOnInit(): void {
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
  }

  onSubmit() {
    this.loaderService.showSpinner();
    this.authService.login(this.formLogin.value).then(response => {
      this.loaderService.hideSpinner();
      this.errorMessageSubj.next(undefined);
      this.authService.isLoggedInSubj.next(true);
      this.router.navigate(['admin/add-content']);
      })
      .catch(error => {
        this.loaderService.hideSpinner();
        this.errorMessageSubj.next(this.authService.handleAuthError(error));
        console.error(error);
      });
  }

  // onClick() {
  //   this.loaderService.showAndHideSpinner();
  //   this.authService.loginWithGoogle().then(response => {
  //     this.errorMessageSubj.next(undefined);
  //     this.authService.isLoggedInSubj.next(true);
  //     this.router.navigate(['admin/add-content']);
  //     })
  //     .catch(error => {
  //       this.errorMessageSubj.next(this.authService.handleAuthError(error));
  //     });
  // }

    ngOnDestroy() {
    this.meta.removeTag("name='robots'");
  }

  


}
