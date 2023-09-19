import { canDeactivateGuard } from "../shared/can-deactivate.guard";
import { AdminAddContentComponent } from "./admin-add-content/admin-add-content.component";
import { AdminComponent } from "./admin.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from "@angular/fire/auth-guard"

export const ADMIN_ROUTES = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '', loadComponent: () => import('./admin.component').then(m=>m.AdminComponent), children: [
            { path: 'login', loadComponent: () => import('./login/login.component').then(m=>m.LoginComponent), ...canActivate(() => redirectLoggedInTo('admin/add-content')) },
            // { path: 'register', loadComponent: () => import('./register/register.component').then(m=>m.RegisterComponent), ...canActivate(() => redirectLoggedInTo('admin/add-content'))},
            { path: 'add-content', loadComponent: () => import('./admin-add-content/admin-add-content.component').then(m=>m.AdminAddContentComponent), canDeactivate: [canDeactivateGuard] }
        ]}
];