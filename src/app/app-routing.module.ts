import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './shared/components/register/register.component';
import { LoginComponent } from './shared/components/login/login.component';
import { AuthGuardService } from './shared/services/auth-guard/auth-guard.service';
import { HomeComponent } from './shared/components/home/home.component';
import { NotAuthorizedComponent } from './shared/components/not-authorized/not-authorized.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AboutComponent } from './shared/components/about/about.component';
import { ProductdetailComponent } from './shared/components/productdetail/productdetail.component';


const routes: Routes = [
  { path:'user', canActivate: [AuthGuardService], loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) }, 
  { path:'admin', canActivate: [AuthGuardService], loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
  { path:'register', canActivate: [AuthGuardService], component: RegisterComponent},
  { path:'login', canActivate: [AuthGuardService], component: LoginComponent},
  { path:'notAuthorized', component: NotAuthorizedComponent},
  { path:'home', component: HomeComponent},
  { path:'pro/:id', component: ProductdetailComponent},
  { path:'about', component: AboutComponent},
  { path:'404', component: NotFoundComponent},
  { path:'**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
