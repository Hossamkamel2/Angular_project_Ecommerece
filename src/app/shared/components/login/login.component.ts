import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../../services/auth-services/register.service';
import { ToastrService } from 'ngx-toastr';
import { AuthSubjectService } from '../../services/state-managment/auth-subject.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  toggle: boolean = false;
  private sub1: any;

  constructor(
    private authService: RegisterService,
    private toastr: ToastrService,
    private authSubjectService: AuthSubjectService,
    private router: Router) { }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  ngOnInit(): void {
  }

  login() {
    const token = localStorage.getItem('token');
    if (token != undefined && token != null && token != "") {
      return this.toastr.warning('You are already login', 'Warning')
    }
    this.toggle = true;
    this.sub1 = this.authService.postLogin(this.loginForm.value)
      .subscribe(result => {
        this.toggle = false;
        if (result.Status == 422) {
          result.Errors.forEach(error => {
            this.toastr.error(error.errorMsg, 'Validation Error!');
          });
        }
        else {
          this.toastr.success('Sign in has been done successfully', 'Success');
          if (result.isAdmin)
            this.authSubjectService.next({ isAuth: true, isAdmin: true })
          else
            this.authSubjectService.next({ isAuth: true, isAdmin: false })
          localStorage.setItem('token', result.token);
          this.router.navigateByUrl('/home');
        }
      })
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
  }

}
