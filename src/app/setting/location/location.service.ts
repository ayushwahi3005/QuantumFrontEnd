import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  myToken!:any
  constructor(private httpClient:HttpClient) {
    this.myToken=localStorage.getItem('authToken');
   
   }
   endpoint=environment.endpoint;
  getLocation(companyId:string):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
    console.log("location-> "+headers.get('Authorization'))
    console.log("companyId->",companyId);
    return this.httpClient.get(this.endpoint+'customer/getAllLocation/'+companyId,{headers});
  }

  saveLocation(data:any):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
   
    return this.httpClient.post(this.endpoint+'customer/addlocation',data,{headers});
  }
  deleteLocation(id:string):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
   
    return this.httpClient.delete(this.endpoint+'customer/deleteLocation/'+id,{headers});
  }
  saveBin(data:any):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
   
    return this.httpClient.post(this.endpoint+'customer/addbin',data,{headers});
  }
  getBin(companyId:string):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
    console.log("location-> "+headers.get('Authorization'))
    console.log("companyId->",companyId);
    return this.httpClient.get(this.endpoint+'customer/getAllBin/'+companyId,{headers});
  }
  deleteBin(id:string):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.myToken}`);
   
    return this.httpClient.delete(this.endpoint+'customer/deleteBin/'+id,{headers});
  }
  
}
