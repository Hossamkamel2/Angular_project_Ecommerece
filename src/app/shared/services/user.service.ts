import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private baseurl:string=environment.domainUrl;
  constructor(private myclient:HttpClient) { }
  addtocart(id):Observable<any> {
    const token=localStorage.getItem('token')
    return this.myclient.post(`${this.baseurl}cart`,id,{headers:{'x-access-token':token}});
  }
  getcartitems():Observable<object>{
    const token=localStorage.getItem('token')
    return this.myclient.get(`${this.baseurl}cart`,{headers:{'x-access-token':token}})
  }
  reduceitem(id){
    const token=localStorage.getItem('token')
    return this.myclient.delete(`${this.baseurl}cart/reduceone/${id}`,{headers:{'x-access-token':token}})
  
  }
  delcartprod(id){
    const token=localStorage.getItem('token')
    return this.myclient.delete(`${this.baseurl}cart/deleteProduct/${id}`,{headers:{'x-access-token':token}})
  
  }
  clearCart(){
    const token=localStorage.getItem('token')
    return this.myclient.delete(`${this.baseurl}cart`,{headers:{'x-access-token':token}})
  
  }
  checkout(){
    const token=localStorage.getItem('token')
    return this.myclient.post(`${this.baseurl}order`,"",{headers:{'x-access-token':token}})
  }
  getorder() : any{
    const token=localStorage.getItem('token')
    return this.myclient.get(`${this.baseurl}order/getMyOrders`,{headers:{'x-access-token':token}})

  }
  deleteOrder(orderId): any{
    const token=localStorage.getItem('token')
    return this.myclient.delete(`${this.baseurl}order/${orderId}`,{headers:{'x-access-token':token}})

  }
  profile(){
    const token=localStorage.getItem('token')
    return this.myclient.get(`${this.baseurl}user`,{headers:{'x-access-token':token}})
  
  }
  editprofile(profile){
    const token=localStorage.getItem('token')
    const formData: any = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    formData.append("gender", profile.gender);
    formData.append("imageUrl", profile.imageUrlBinary);
    return this.myclient.patch(`${this.baseurl}user`,formData,{headers:{'x-access-token':token}})

  }
}
