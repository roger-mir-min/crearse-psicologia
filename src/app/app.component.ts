import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { BodyComponent } from './core/body/body.component';
import { AuthService } from './services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, BodyComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'crearse';

  user;

  loading$: Observable<boolean>;
  
  constructor(private authService: AuthService, private loaderService: LoaderService,
  private ccService: NgcCookieConsentService) {
    this.user = this.authService.user;
    this.loading$ = this.loaderService.isLoading$;
  }

  //keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription!: Subscription;
  private popupCloseSubscription!: Subscription;
  private initializingSubscription!: Subscription;
  private initializedSubscription!: Subscription;
  private initializationErrorSubscription!: Subscription;
  private statusChangeSubscription!: Subscription;
  private revokeChoiceSubscription!: Subscription;
  private noCookieLawSubscription!: Subscription;

  ngOnInit() {
    this.loaderService.showAndHideSpinner();


  }

    ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializingSubscription.unsubscribe();
    this.initializedSubscription.unsubscribe();
    this.initializationErrorSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }


}
