import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecretService {

  constructor(private httpClient: HttpClient) {}

  getSecrets(): Observable<any> {
    return this.httpClient.get('/secret/');
  }

  // initializeEnvironmentVariables(): Promise<any> {
  //   return this.getSecrets().toPromise().then((data: any) => {
  //     // Initialize environment variables from the fetched data
      
  //     environment.firebaseConfig = data;
  //     // console.log( environment.firebaseConfig)
  //     // console.log( environment.firebaseConfig.apiKey)
  //     resolve();

  //   }).catch(error => {
  //     console.error('Error fetching secrets:', error);
  //     return Promise.reject(error);
  //   });
  // }
  initializeEnvironmentVariables(){
    return new Promise<void>((res,rej)=>{
      this.httpClient.get('/secret/').subscribe((data:any)=>{
    
       environment.firebaseConfig=data;
       
       if(environment.firebaseConfig.apiKey!=""){
      res();
       }
      
      },
    (err)=>{
      console.log(err);
      rej();
    })
    })
  }
}
