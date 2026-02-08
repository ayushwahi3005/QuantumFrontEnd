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
  
  getAllImportHistory(companyId:any,pageNumber:any,pageSize:any,startDate:any,endDate:any):Observable<any>{
    // let startDateParam = startDate ? `&startDate=${startDate.toISOString()}` : '';
    // let endDateParam = endDate ? `&endDate=${endDate.toISOString()}` : '';
   let obj = {};
    if(startDate != null && endDate != null) {
      obj = {
        startDate: startDate,
        endDate: endDate
      };
    }
    console.log(obj);
    
      
    return this.httpClient.post(this.customerEndpoint+"getAllImportHistory/"+companyId+"?pageNumber="+pageNumber+"&pageSize="+pageSize,obj,{headers:this.headers});
  }
}
