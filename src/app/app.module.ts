import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { CookiesPolicyComponent } from './cookies-policy/cookies-policy.component';

@NgModule({
  declarations: [	
   ],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }