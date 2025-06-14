import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleAndPermissionService {
  endpoint=environment.endpoint;
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json',
    'Device-ID': `${localStorage.getItem('deviceId')}`
  });
  constructor(private httpClient:HttpClient) { }

  addRoleAndPermission(data:any):Observable<any>{
    return this.httpClient.post(this.endpoint+'customer/roleAndPermission/add',data,{headers:this.headers});
  }
  updateRoleAndPermission(data:any):Observable<any>{
    return this.httpClient.put(this.endpoint+'customer/roleAndPermission/update',data,{headers:this.headers});
  }
  getRoleAndPermission(id:string):Observable<any>{
    return this.httpClient.get(this.endpoint+'customer/roleAndPermission/get/'+id,{headers:this.headers});
  }
  countByRoleAndCompanyId(name:string,id:string):Observable<any>{
    return this.httpClient.get(this.endpoint+'customer/countByRole/'+id+'/'+name,{headers:this.headers});
  }
  deleteRoleAndPermission(id:string):Observable<any>{
    return this.httpClient.delete(this.endpoint+'customer/roleAndPermission/'+id,{headers:this.headers});
  }

}
