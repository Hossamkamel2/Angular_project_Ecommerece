import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { RegisterService } from './shared/services/auth-services/register.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AuthSubjectService } from './shared/services/state-managment/auth-subject.service';
import { LoginComponent } from './shared/components/login/login.component';
import { HomeComponent } from './shared/components/home/home.component';
import { NotAuthorizedComponent } from './shared/components/not-authorized/not-authorized.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AboutComponent } from './shared/components/about/about.component';
import { VisitorsService } from './shared/services/visitors.service';
import { ProductdetailComponent } from './shared/components/productdetail/productdetail.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    NotAuthorizedComponent,
    NotFoundComponent,
    AboutComponent,
    ProductdetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ToastrModule.forRoot()
  ],
  providers: [
    RegisterService,
    AuthSubjectService,
    VisitorsService,
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
