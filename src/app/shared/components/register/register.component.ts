import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../../services/auth-services/register.service';
import { ToastrService } from 'ngx-toastr';
import { AuthSubjectService } from '../../services/state-managment/auth-subject.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  toggle:boolean = false;
  private sub1: any;

  constructor(
    private authService: RegisterService,
    private toastr: ToastrService, 
    private authSubjectService: AuthSubjectService,
    private router: Router) { }

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl('', [Validators.required]),
    gender: new FormControl('', Validators.required),
  }, this.pwdMatchValidator);

  get username() {return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get gender() { return this.registerForm.get('gender'); }


  ngOnInit(): void {
  }

  pwdMatchValidator(frm: FormGroup) {
    return frm.get('password').value === frm.get('confirmPassword').value
      ? null : { 'mismatch': true };
  }

  register() {
    this.toggle = true;
    this.registerForm.value.gender = Number.parseInt(this.registerForm.value.gender);
    this.sub1 = this.authService.postRegister(this.registerForm.value)
      .subscribe(result => {
        this.toggle = false;
        if (result.Status == 422) {
          result.Errors.forEach(error => {
            this.toastr.error(error.errorMsg, 'Validation Error!');
          });
        }
        else{
          this.toastr.success('Sign up has been done successfully','Success');
          if(result.isAdmin)
            this.authSubjectService.next({isAuth: true, isAdmin: true})
          else
            this.authSubjectService.next({isAuth: true, isAdmin: false})
          localStorage.setItem('token', result.token);
          this.router.navigateByUrl('/home');
        }
      })
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
  }

}
