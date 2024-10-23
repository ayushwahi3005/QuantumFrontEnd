import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private triggerFunctionSubjectRegister = new Subject<void>();
  constructor(private httpClient:HttpClient) { }
 customerEndpoint=environment.endpoint+"customer/"
 userEndpoint=environment.endpoint+"users/"
  register(data:any):Observable<any>{
  
    return this.httpClient.post(this.customerEndpoint+'addUser',data);
  }
  getUser(companyId:string,token:string){
    return this.httpClient.get(this.userEndpoint+'invite/getUser/'+companyId+'/'+token);
  }
  triggerComponentFunctionRegister(data:any) {
    console.log("trigger register vallleeddd")
    this.triggerFunctionSubjectRegister.next(data);
  }

  getTriggerFunctionSubjectRegister() {
    return this.triggerFunctionSubjectRegister.asObservable();
  }
}
