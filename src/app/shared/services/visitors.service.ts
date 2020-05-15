import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class VisitorsService {
  private baseUrl: string = environment.domainUrl;

  
  constructor(private myclient: HttpClient) {
    // this.number = this.myclient.get<any>(`${this.baseUrl}product/pagination?pageNumber=${this.data}&pageSize=6`).subscribe(result => {
    //   if (result.totalCount % 4 > 0)
    //     this.x = (result.totalCount / 4) + 1
    //   else {
    //     this.x = (result.totalCount / 4);
    //   }
    // })
  }


  getSomeProducts() {
    return this.myclient.get<any>(`${this.baseUrl}product/pagination?pageNumber=1&pageSize=6`)
  }

  getDetails(id) {
    return this.myclient.get(`${this.baseUrl}product/${id}`)
  }

  getAllproducts(): Observable<any> {
    const token = localStorage.getItem('token')
    return this.myclient.get(`${this.baseUrl}product`, {
      headers: { 'x-access-token': token }
    })
  }

  deleteProduct(id): Observable<any> {
    const token = localStorage.getItem('token')
    return this.myclient.delete(`${this.baseUrl}product/${id}`, {
      headers: { 'x-access-token': token }
    })
  }

}
