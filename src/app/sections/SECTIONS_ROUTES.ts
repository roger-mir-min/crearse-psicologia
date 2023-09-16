import { canDeactivateGuard } from '../shared/can-deactivate.guard';


export const SECTIONS_ROUTES = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', loadComponent: () => import('./home/home.component').then(m=>m.HomeComponent), canDeactivate: [canDeactivateGuard]},
    { path: 'about', loadComponent: () => import('./about/about.component').then(m=>m.AboutComponent), canDeactivate: [canDeactivateGuard] },
    {
        path: 'services', loadComponent: () => import('./services-components/services-components.component').then(m=>m.ServicesComponent), children: [
            { path: '', redirectTo: 'info' , pathMatch: 'full'},
            { path: 'info', loadComponent: () => import('./services-components/info/info.component').then(m=>m.InfoComponent), canDeactivate: [canDeactivateGuard] },
            { path: 'terms', loadComponent: () => import('./services-components/terms/terms.component').then(m => m.TermsComponent), canDeactivate: [canDeactivateGuard] },
            {
                path: 'emotional-support', loadComponent: () => import('./services-components/emotional-support/emotional-support.component').then(m => m.EmotionalSupportComponent), children: [
                    { path: '', loadComponent: () => import('./services-components/emotional-support/em-support-list/em-support-list.component').then(m => m.EmSupportListComponent) },
                    { path: ':slug', loadComponent: () => import('./services-components/emotional-support/em-support/em-support.component').then(m => m.EmSupportComponent), canDeactivate: [canDeactivateGuard]}
            ] },
            {
                path: 'women-circles', loadComponent: () => import('./services-components/women-circles/women-circles.component').then(m => m.WomensCircleComponent), children: [
                    { path: '', loadComponent: () => import('./services-components/women-circles/women-circles-list/women-circles-list.component').then(m => m.WomenCircleListComponent) },
                    { path: ':slug', loadComponent: () => import('./services-components/women-circles/women-circle/women-circle.component').then(m => m.WomenCircleComponent), canDeactivate: [canDeactivateGuard] }
            ] },
            {
                path: 'courses', loadComponent: () => import('./services-components/courses/courses.component').then(m=>m.CoursesComponent), children: [
                    { path: '', loadComponent: () => import('./services-components/courses/courses-list/courses-list.component').then(m=>m.CoursesListComponent) },
                    { path: ':slug', loadComponent: () => import('./services-components/courses/course/course.component').then(m=>m.CourseComponent), canDeactivate: [canDeactivateGuard] }
            ]},
    ] },
    {
        path: 'blog', loadComponent: () => import('./articles/articles.component').then(m=>m.ArticlesComponent), children: [
            { path: '', loadComponent: () => import('./articles/articles-list/articles-list.component').then(m=>m.ArticlesListComponent) },
            { path: ':slug', loadComponent: () => import('./articles/article/article.component').then(m=>m.ArticleComponent), canDeactivate: [canDeactivateGuard] }
    ]}
];