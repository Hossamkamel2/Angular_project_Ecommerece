import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import {addproduct} from '../models/add-product'
@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  private baseUrl: string = environment.domainUrl;

  constructor(private myclient:HttpClient) { }
  getProductDetail(id):Observable<any>{
    const token=localStorage.getItem('token')
      return this.myclient.get(`${this.baseUrl}product/${id}`,{headers:{'x-access-token':token}})
  }
  postproduct(product){
    const token=localStorage.getItem('token')
    const formData: any = new FormData();
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("imageUrl", product.imageUrl);
    return this.myclient.post(`${this.baseUrl}product`,formData,{headers:{'x-access-token':token}})
  }
  editproduct(product){
    const token=localStorage.getItem('token')
    const formData: any = new FormData();
    formData.append("_id", product._id);
    formData.append("title", product.title);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("imageUrl", product.imageUrl);
    return this.myclient.patch(`${this.baseUrl}product`,formData,{headers:{'x-access-token':token}})
  }
  getallorders() : any{
    const token=localStorage.getItem('token')
    return this.myclient.get(`${this.baseUrl}order`,{headers:{'x-access-token':token}})

  }
  manipulateorder(id,status){
    const token=localStorage.getItem('token')
    return this.myclient.patch(`${this.baseUrl}order`,{"orderId":id,"statusId":status},{headers:{'x-access-token':token}})

  }
}
