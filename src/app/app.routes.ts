import { Routes } from '@angular/router';
import { AccueilComponent } from './home/accueil/accueil.component';
import { ProComponent } from './professionnal/pro-main/pro.component';
import { ArticlesComponent } from './articles/articles.component';
import { Error404Component } from './error404/error404.component';
import { InscriptionComponent } from './User/inscription/inscription.component';
import { ConnexionComponent } from './User/connexion/connexion.component';
import { ServicesComponent } from './professionnal/services/services.component';
import { DevisComponent } from './professionnal/devis/devis.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { AdminComponent } from './admin/admin/admin.component';
import { LoginComponent } from './shared/services/auth/auth/components/login/login.component';

export const routes: Routes = [
    { path: '', component : AccueilComponent},
    { path: 'pro', component : ProComponent},
    { path: 'pro/services', component : ServicesComponent},
    { path: 'pro/devis', component : DevisComponent},
    { path: 'articles', component : ArticlesComponent},
    { path: 'connexion/inscription', component : InscriptionComponent},
    { path: 'login', component : LoginComponent},
    { path: 'admin',component: AdminComponent,canActivate: [AuthGuard]},
    { path: '**', component : Error404Component}

];
