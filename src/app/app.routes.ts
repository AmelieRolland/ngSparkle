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
import { MessagesComponent } from './admin/messages-list/messages.component';
import { EmployesComponent } from './admin/employes/employes.component';
import { ArticlesListComponent } from './admin/articles-list/articles-list.component';
import { ArticleFormComponent } from './admin/article-form/article-form.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { FabricFormComponent } from './admin/fabric-form/fabric-form.component';
import { ServiceFormComponent } from './admin/service-form/service-form.component';
import { MessageComponent } from './admin/message/message.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderDetailComponent } from './admin/order-detail/order-detail.component';

export const routes: Routes = [
    { path: '', component : AccueilComponent},
    { path: 'pro', component : ProComponent},
    { path: 'pro/services', component : ServicesComponent},
    { path: 'pro/devis', component : DevisComponent},
    { path: 'panier', component : CartComponent},
    { path: 'articles', component : ArticlesComponent},
    { path: 'login/inscription', component : InscriptionComponent},
    { path: 'login', component : LoginComponent},
    { path: 'paiement', component: PaymentComponent, canActivate: [authGuard]},
    { path: 'mon-compte', component: UserAccountComponent, canActivate: [authGuard]},
    { path: 'admin',component: AdminComponent, canActivate: [authGuard], data: { roles: 'ROLE_ADMIN'}, children: [
        { path: 'commandes', component: OrdersComponent},
        { path: 'commandes/:id', component: OrderDetailComponent }, 
        { path: 'messages', component: MessagesComponent },
        { path: 'messages/:id', component: MessageComponent },
        { path: 'articles', component: ArticlesListComponent },
        { path: 'articles/new', component: ArticleFormComponent },
        { path: 'articles/modifier/:id', component: ArticleFormComponent },
        { path: 'fabrics/new', component: FabricFormComponent },
        { path: 'fabrics/modifier/:id', component: FabricFormComponent },
        { path: 'service/new', component: ServiceFormComponent },
        { path: 'service/modifier/:id', component: ServiceFormComponent },
        { path: 'employes', component: EmployesComponent },
        { path: '', redirectTo: 'commandes', pathMatch: 'full' },
      ]},
    { path: '**', component : Error404Component}

];
