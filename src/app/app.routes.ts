import { Routes } from '@angular/router';
import { AccueilComponent } from './home/accueil/accueil.component';
import { ProComponent } from './professionnal/pro-main/pro.component';
import { ArticlesComponent } from './articles/articles.component';
import { Error404Component } from './error404/error404.component';

export const routes: Routes = [
    { path: '', component : AccueilComponent},
    { path: 'pro', component : ProComponent},
    { path: 'articles', component : ArticlesComponent},
    { path: '**', component : Error404Component}
];
