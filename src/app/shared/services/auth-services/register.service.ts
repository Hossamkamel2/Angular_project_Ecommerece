import { Injectable } from '@angular/core';   
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterUser } from '../../models/register-user';
import { environment } from '../../../../environments/environment';
import { LoginUser } from '../../models/login-user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseUrl: string = environment.domainUrl;

  constructor(private http: HttpClient) { }

  postRegister(user:RegisterUser):Observable<any>{
    return this.http.post(`${this.baseUrl}auth/signup`,user);
  }

  postLogin(user:LoginUser):Observable<any>{
    return this.http.post(`${this.baseUrl}auth/login`,user);
  }

}
