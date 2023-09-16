import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { environment } from './environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { ShareButtonModule } from 'ngx-sharebuttons/button';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PageNotFoundComponent } from './app/core/page-not-found/page-not-found.component';
import {NgcCookieConsentModule, NgcCookieConsentConfig} from 'ngx-cookieconsent';
import { provideServiceWorker } from '@angular/service-worker';

const routes: any = [
  { path: '', loadChildren: () => import('./app/sections/SECTIONS_ROUTES').then(mod=>mod.SECTIONS_ROUTES) },
  { path: 'admin', loadChildren: () => import('./app/admin/ADMIN_ROUTES').then(mod => mod.ADMIN_ROUTES) },
  { path: 'cookies-policy', loadComponent: () => import('./app/cookies-policy/cookies-policy.component').then(m => m.CookiesPolicyComponent) },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

const cookieConfig: NgcCookieConsentConfig = {
  "cookie": {
    "domain": "crearse-a80cc.web.app"
  },
  "position": "bottom",
  "theme": "classic",
  "palette": {
    "popup": {
      "background": "#000000",
      "text": "#ffffff",
      "link": "#ffffff"
    },
    "button": {
      "background": "#9bc3dd",
      "text": "#000000",
      "border": "transparent"
    }
  },
  "type": "opt-out",
  "content": {
    message: "Este sitio usa cookies para asegurarte una mejor experiencia. - This website uses cookies to ensure you get the best experience on our website.",
    dismiss: "Ok!",
    deny: "Denegar cookies",
    allow: "Permitir cookies",
    link: "Saber más",
    href: "cookies-policy",
    policy: "Cookie Policy"
  },
  layout: 'my-custom-layout',
  layouts: {
    "my-custom-layout": '{{messagelink}}{{compliance}}'
  },
  elements: {
    message: ``,
    dismiss: '<a aria-label="Ok, acepto todas las cookies" tabindex="0" class="cc-btn cc-dismiss">{{dimiss}}</a>',
    allow: '<a aria-label="Permitir cookies" tabindex="0" class="cc-btn cc-allow">{{allow}}</a>',
    deny: '<a aria-label="Denegar cookies" tabindex="0" class="cc-btn cc-deny">{{deny}}</a>',
    link: '<a aria-label="Saber más sobre cookies" tabindex="0" class="cc-link" href="" target="_blank">{{link}}</a>',
  }
};


bootstrapApplication(AppComponent,
  {
    providers: [provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebase))),
    importProvidersFrom(HttpClientModule, ReactiveFormsModule, FormsModule, ShareIconsModule, ShareButtonModule, ShareButtonsModule, AngularEditorModule, InfiniteScrollModule, NgcCookieConsentModule.forRoot(cookieConfig)),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideStorage(() => getStorage())), provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })]
    
  }).catch(e => console.error(e));
