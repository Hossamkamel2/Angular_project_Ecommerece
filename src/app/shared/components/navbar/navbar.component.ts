import { Component, OnInit } from '@angular/core';
import { AuthSubjectService } from '../../services/state-managment/auth-subject.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isAdmin = false;
  isAuth = false;
  navbarOpen = false;
  show: boolean = false;
  flag: boolean = true;
  private sub1: any;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  constructor(private authSubjectService: AuthSubjectService, private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
      this.flag = false;
      this.sub1 = this.authSubjectService.getSubject().subscribe(result=> {
        this.isAdmin = result.isAdmin;
        this.isAuth = result.isAuth;
      })
  }

  logout(){
    localStorage.removeItem('token');
    this.authSubjectService.next({isAdmin: false, isAuth: false});
    this.toastr.success('Log out has been done successfully','Success')
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
  }

  toggleShow(){
    this.show = !this.show
  }

}
