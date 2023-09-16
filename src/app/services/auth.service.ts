import { Injectable } from '@angular/core';
import {
  getAuth, Auth, AuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, signInWithPopup, GoogleAuthProvider
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { onAuthStateChanged } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = onAuthStateChanged(this.auth, (user) => {
    if (user) {
      this.isLoggedInSubj.next(true);
      //Ho trec perquè és molest quan estàs editant i vols veure resultat refrescant
      // this.router.navigate(['admin/add-content']);
      console.log('User is signed in.');
    } else {
      this.isLoggedInSubj.next(false);
      console.log('No user is signed in.');
    }
  });

  isLoggedInSubj = new BehaviorSubject(false);
  isLoggedIn$ = this.isLoggedInSubj.asObservable();

constructor(private auth: Auth, private router: Router) { }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  registerWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

loginWithGoogle() {
  return signInWithPopup(this.auth, new GoogleAuthProvider())
    // .then((result) => {
    //     if (result.user?.email === 'crearsearteterapia@gmail.com') {
    //         console.log('Admin logged in');
    //         return result;
    //     } else {
    //         console.error('Unauthorized access attempt');
    //         this.logout();
    //         throw new Error('Unauthorized access');
    //     }
    // });
}


  logout() {
    return signOut(this.auth);
  }

  handleAuthError(error: any): string {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Correo y/o contraseña incorrectos.';
        break;
      case 'auth/missing-email':
        return "No se ha introducido correo electrónico.";
        break;
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido inhabilitada.';
        break;
      case 'auth/user-not-found':
        return 'Correo y/o contraseña incorrectos.';
        break;
      case 'auth/wrong-password':
        return 'Correo y/o contraseña incorrectos.';
        break;
        case 'auth/popup-closed-by-user':
        return  'El diálogo de autenticación se ha cerrado antes de finalizar.';
        break;
      default:
        return 'Ha habido un error desconocido. Puede que la acción no se haya completado correctamente. Por favor, vuelva a intentarlo más tarde.';
    }
}


}
