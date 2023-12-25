import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpClient:HttpClient) { }

  register(formData:any):Observable<any>{
    return this.httpClient.post('http://localhost:8080/customer/addCustomer', formData);
  }
}
