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
import { OrderEditComponent } from './admin/order-edit/order-edit.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'pro', component: ProComponent },
  { path: 'pro/services', component: ServicesComponent },
  { path: 'pro/devis', component: DevisComponent },
  { path: 'panier', component: CartComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'login/inscription', component: InscriptionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'paiement', component: PaymentComponent, canActivate: [authGuard] },
  { path: 'mon-compte', component: UserAccountComponent, canActivate: [authGuard] },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [authGuard], 
    data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] }, 
    children: [
        { path: 'commandes', component: OrdersComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] }},
        { path: 'commandes/:id', component: OrderDetailComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] }},
        { path: 'commandes/edit/:id', component: OrderEditComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
        { path: 'messages', component: MessagesComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] }},
        { path: 'messages/:id', component: MessageComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] }},
        { path: 'articles', component: ArticlesListComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
        { path: 'articles/new', component: ArticleFormComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
        { path: 'articles/modifier/:id', component: ArticleFormComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
        { path: 'fabrics/new', component: FabricFormComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
        { path: 'fabrics/modifier/:id', component: FabricFormComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
        { path: 'service/new', component: ServiceFormComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
        { path: 'service/modifier/:id', component: ServiceFormComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN'] }},
        { path: 'employes', component: EmployesComponent, canActivate: [authGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] }},
        { path: '', redirectTo: 'commandes', pathMatch: 'full' },
    ]
  },
  { path: '**', component: Error404Component }
];

