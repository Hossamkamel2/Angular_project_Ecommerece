import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthSubjectService } from '../state-managment/auth-subject.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private authSubjectService: AuthSubjectService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.authSubjectService.getSubject().subscribe(result => {
      if(next.url[0].path == "user" && result.isAuth == false || next.url[0].path == "admin" && result.isAuth == false){
        this.router.navigate(['/login']);
        return false
      }
      if(next.url[0].path == "user" && result.isAuth != true || next.url[0].path == "user" && result.isAdmin == true || next.url[0].path == "admin" && result.isAdmin != true){
        this.router.navigate(['/notAuthorized']);
        return false
      }
      else if(next.url[0].path == "login" && result.isAuth != false || next.url[0].path == "register" && result.isAuth != false){
        this.router.navigate(['/home']);
        return false
      }
      else{
        return true;
      }
    });
    return true;
  }
  
}
