import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportHistoryService {
  customerEndpoint=environment.endpoint+"customer/";
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`
  });
  constructor(private httpClient:HttpClient) { }
  
  getAllImportHistory(companyId:any,pageNumber:any,pageSize:any):Observable<any>{
    return this.httpClient.get(this.customerEndpoint+"getAllImportHistory/"+companyId+"?pageNumber="+pageNumber+"&pageSize="+pageSize,{headers:this.headers});
  }
}
