import { Routes } from '@angular/router';
import { AccueilComponent } from './home/accueil/accueil.component';
import { ProComponent } from './professionnal/pro-main/pro.component';
import { ArticlesComponent } from './articles/articles.component';
import { Error404Component } from './error404/error404.component';
import { InscriptionComponent } from './User/inscription/inscription.component';
import { ServicesComponent } from './professionnal/services/services.component';
import { DevisComponent } from './professionnal/devis/devis.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './shared/services/auth/auth/components/login/login.component';
import { CartComponent } from './cart/cart.component';
import { authGuard } from './shared/services/auth/auth.guard';
import { MessagesComponent } from './admin/messages/messages.component';
import { EmployesComponent } from './admin/employes/employes.component';
import { ArticlesListComponent } from './admin/articles-list/articles-list.component';
import { ArticleFormComponent } from './admin/article-form/article-form.component';
import { OrdersComponent } from './admin/orders/orders.component';

export const routes: Routes = [
    { path: '', component : AccueilComponent},
    { path: 'pro', component : ProComponent},
    { path: 'pro/services', component : ServicesComponent},
    { path: 'pro/devis', component : DevisComponent},
    { path: 'panier', component : CartComponent},
    { path: 'articles', component : ArticlesComponent},
    { path: 'login/inscription', component : InscriptionComponent},
    { path: 'login', component : LoginComponent},
    { path: 'admin',component: AdminComponent, canActivate: [authGuard], children: [
        { path: 'commandes', component: OrdersComponent},
        { path: 'messages', component: MessagesComponent },
        { path: 'articles', component: ArticlesListComponent },
        { path: 'articles/new', component: ArticleFormComponent },
        { path: 'articles/modifier/:id', component: ArticleFormComponent },
        { path: 'employes', component: EmployesComponent },
        { path: '', redirectTo: 'commandes', pathMatch: 'full' },
      ]},
    { path: '**', component : Error404Component}

];
