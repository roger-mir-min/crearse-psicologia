import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { UrlTree } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component: CanComponentDeactivate) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};
