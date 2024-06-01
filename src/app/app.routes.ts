import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { MembreComponentsComponent } from './component/membre-components/membre-components.component';
import { LayoutComponent } from './component/layout/layout.component';
import { SignupComponent } from './component/signup/signup.component';
import { EmprunteComponent } from './component/emprunte/emprunte.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LivresComponent } from './component/livres/livres.component';
import { AjoutMembreComponent } from './component/ajout-membre/ajout-membre.component';
import { HistoriqueComponent } from './component/historique/historique.component';

export const routes: Routes = [
    {
        path: 'login', title: "Log In", component: LoginComponent
    },
    {
        path: 'signup', title: "Sign Up", component: SignupComponent
    },
    {
        path: "", redirectTo: "/login", pathMatch: "full"
    },
    {
        path: "layout", title: "Bibliotheque", component: LayoutComponent,
        children: [
            {
                path: "listeMembres", title: "Membres", component: MembreComponentsComponent
            },
            {
                path: "emprunte", title: "Emprunte page", component: EmprunteComponent
            },
            {
                path: "dashboard", title: "Dashboard", component: DashboardComponent
            },
            {
                path: "livre", title: "Livres", component: LivresComponent
            },
            {
                path: "nouveau_membre", title: "Membres", component: AjoutMembreComponent
            },
            {
                path: "historiques", title: "Historique emprunte", component: HistoriqueComponent
            }
        ]
    }
]
