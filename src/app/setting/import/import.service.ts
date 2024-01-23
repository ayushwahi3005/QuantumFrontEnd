import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private httpClient:HttpClient) { }

  getAssets(companyId:string):Observable<any>{
    console.log("companyId->",companyId);
    return this.httpClient.get('http://localhost:8081/assets/'+companyId);
  }
  addAssets(myFile:any,companyId:string):Observable<any>{
    return this.httpClient.post('http://localhost:8081/assets/import/'+companyId,myFile);
  }
  updateAssets(myFile:any,companyId:string,columnMappings:any):Observable<any>{
    return this.httpClient.post('http://localhost:8081/assets/importUpdation/'+companyId,myFile,columnMappings);
  }
  getExtraFields(id:string):Observable<any>{
   
    return this.httpClient.get("http://localhost:8081/assets/getExtraFieldName/"+id);
  }
}
