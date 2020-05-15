import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthSubjectService {

  private baseUrl: string = environment.domainUrl;

  private data = {isAuth:false, isAdmin: false}
  private subject = new BehaviorSubject(this.data);

  constructor(private http: HttpClient) { }

   getSubject(){
    const token = localStorage.getItem('token');
    if(this.data.isAdmin == false && this.data.isAuth == false && token != undefined && token != ""){
      this.http.post<{isAuth: boolean, isAdmin: boolean}>(this.baseUrl+'auth/verify',{token: token}).subscribe(result => {
        this.subject.next(result);
        if(!result.isAuth){
          localStorage.removeItem('token');
        }
        return this.subject;
      })
      return this.subject;
    }
    else
      return this.subject;
  }

  next(data){
    this.data = data;
    this.subject.next(data);
  }

  current(){
    return this.subject.value
  }
}
